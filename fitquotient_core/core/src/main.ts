import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import type {
  FastifyPluginCallback,
  RawServerDefault,
  FastifyTypeProvider,
  FastifyBaseLogger,
} from 'fastify';
import multipart from '@fastify/multipart';
// Import fastify static plugin using ES imports to satisfy lint rules
import fastifyStatic from '@fastify/static';
import cors from '@fastify/cors';
import { AppModule } from './app.module';
import { log } from '@common/utilities';
import { RateLimiterGuard } from '@common/guards/rate-limiter.guard';
import { RateLimiterService } from '@common/services/rate-limiter.service';

log.debug(`Env lsha256 -r kubuntu-22.04-desktop-amd64.iso
oaded from: ${path.resolve(process.cwd(), '.env')}`);

async function bootstrap() {
  log.info('Starting server initialization...');

  const fastifyAdapter = new FastifyAdapter({
    bodyLimit: 5 * 1024 * 1024, // 5MB
  });

  const fastifyInstance = fastifyAdapter.getInstance();

  try {
    const CORS_ORIGINS = (
      process.env.CORE_CORS_ORIGINS ||
      'http://localhost:3000,http://127.0.0.1:3000'
    )
      .split(',')
      .map((o) => o.trim());

    await fastifyInstance.register(cors, {
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (CORS_ORIGINS.includes('*')) return cb(null, true);
        cb(null, CORS_ORIGINS.includes(origin));
      },
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'Origin',
        'X-Requested-With',
      ],
    });
    log.info(
      `✓ @fastify/cors plugin registered (allowed origins: ${CORS_ORIGINS.join(',')})`,
    );
    // Explicitly cast multipart to the expected Fastify plugin type
    // Note: cast via `unknown` to avoid unsafe any assignment lint errors
    const typedMultipart = multipart as unknown as FastifyPluginCallback<
      { limits: { fileSize: number }; attachFieldsToBody: boolean },
      RawServerDefault,
      FastifyTypeProvider,
      FastifyBaseLogger
    >;

    await fastifyInstance.register(typedMultipart, {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      attachFieldsToBody: false,
    });
    log.info('✓ @fastify/multipart plugin registered successfully');

    // Serve uploads directory as static files (only in local/dev mode)
    try {
      await fastifyInstance.register(fastifyStatic, {
        root: path.join(process.cwd(), 'uploads'),
        prefix: '/uploads/',
      });
      log.info('✓ @fastify/static plugin registered for /uploads');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      log.warn(`Could not register static uploads plugin: ${message}`);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    log.error(`Failed to register multipart plugin: ${message}`);
    throw err;
  }

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );

  // Apply global rate limiter guard
  const rateLimiterService = app.get(RateLimiterService);
  app.useGlobalGuards(new RateLimiterGuard(rateLimiterService));

  // Apply global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Health check route
  fastifyInstance.get('/healthcheck', (request, reply) => {
    reply.send({ status: 'OK' });
  });

  // Listen port - hardcoded for container consistency
  const CORE_HOST = process.env.CORE_HOST || '0.0.0.0';
  const CORE_PORT = 5400; // Always use port 5400 in container
  await app
    .listen(CORE_PORT, CORE_HOST)
    .then(() => log.info(`Server running on http://localhost:${CORE_PORT}`))
    .catch((err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      log.error(`Server failed to start: ${message}`);
    });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    log.warn('Received SIGINT, shutting down gracefully...');
    void app
      .close()
      .then(() => {
        log.info('Application closed successfully');
        process.exit(0);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : String(err);
        log.error(`Application shutdown error: ${message}`);
        process.exit(1);
      });
  });

  process.on('SIGTERM', () => {
    log.warn('Received SIGTERM, shutting down gracefully...');
    void app
      .close()
      .then(() => {
        log.info('Application closed successfully');
        process.exit(0);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : String(err);
        log.error(`Application shutdown error: ${message}`);
        process.exit(1);
      });
  });
}

// Start bootstrap
bootstrap().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  log.error(`Bootstrap failed: ${message}`);
  process.exit(1);
});
