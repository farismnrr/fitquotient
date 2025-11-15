import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { log } from '@common/utilities';

log.debug(`Env loaded from: ${path.resolve(process.cwd(), '.env')}`);

async function bootstrap() {
  log.info('Starting server initialization...');

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Listen port
  const PORT = Number(process.env.PORT) || 3000;
  await app
    .listen(PORT, '0.0.0.0')
    .then(() => log.info(`Server running on http://localhost:${PORT}`))
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
