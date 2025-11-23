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
import { AppModule } from './app.module';
import { log } from '@common/utilities';
import { RateLimiterGuard } from '@common/guards/rate-limiter.guard';
import { RateLimiterService } from '@common/services/rate-limiter.service';

log.debug(`Env loaded from: ${path.resolve(process.cwd(), '.env')}`);

async function bootstrap() {
  log.info('Starting server initialization...');

  const fastifyAdapter = new FastifyAdapter({
    bodyLimit: 5 * 1024 * 1024, // 5MB
  });

  const fastifyInstance = fastifyAdapter.getInstance();

  try {
    // Register multipart plugin BEFORE creating NestJS app
    await fastifyInstance.register(
      multipart as FastifyPluginCallback<
        { limits: { fileSize: number }; attachFieldsToBody: boolean },
        RawServerDefault,
        FastifyTypeProvider,
        FastifyBaseLogger
      >,
      {
        limits: {
          fileSize: 5 * 1024 * 1024, // 5MB
        },
        attachFieldsToBody: false,
      },
    );
    log.info('✓ @fastify/multipart plugin registered successfully');
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

  // Listen port
  const CORE_HOST = process.env.CORE_HOST || '0.0.0.0';
  const CORE_PORT = Number(process.env.CORE_PORT) || 5400;
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
