import { DataSource } from 'typeorm';
import { log } from '../utilities';
import { InfrastructureError } from './infrastructure.error';

/**
 * Base class for database connections with common functionality
 * Implements retry logic, health monitoring, and graceful shutdown
 */
export abstract class BaseDatabaseConnection {
  public dataSource: DataSource;
  protected reconnecting = false;
  protected hasLoggedInitialError = false;
  protected isShuttingDown = false;
  protected abstract databaseName: string;

  constructor() {
    this.dataSource = null as unknown as DataSource;
  }

  /**
   * Initialize the database connection
   */
  async init(): Promise<void> {
    if (!this.dataSource) {
      this.dataSource = this.createDataSource();
    }
    await this.connectWithRetry();
    void this.monitorConnection();
  }

  /**
   * Create DataSource instance - must be implemented by subclasses
   */
  protected abstract createDataSource(): DataSource;

  /**
   * Attempt to connect with retry logic
   */
  private async connectWithRetry(): Promise<void> {
    if (this.isShuttingDown) return;

    try {
      await this.dataSource.initialize();
      this.reconnecting = false;
      this.hasLoggedInitialError = false;
      log.info(`${this.databaseName} connected successfully.`);
    } catch (err) {
      const message = InfrastructureError(err);

      if (!this.hasLoggedInitialError) {
        this.hasLoggedInitialError = true;
        log.error(`Connection failed: ${message}`);
      }

      if (!this.reconnecting) {
        this.reconnecting = true;
        log.warn(
          `${this.databaseName} disconnected, attempting to reconnect...`,
        );
      }

      // Retry after delay
      setTimeout(() => void this.connectWithRetry(), 3000);
    }
  }

  /**
   * Monitor connection health periodically
   */
  private async monitorConnection(): Promise<void> {
    while (!this.isShuttingDown) {
      await new Promise((r) => setTimeout(r, 5000));
      if (!this.dataSource.isInitialized) continue;

      try {
        await this.dataSource.query('SELECT 1');
      } catch (err) {
        const message = InfrastructureError(err);
        log.error(`Lost connection: ${message}`);
        log.warn(
          `${this.databaseName} disconnected, attempting to reconnect...`,
        );
        this.reconnecting = true;

        try {
          await this.dataSource.destroy();
        } catch (destroyErr) {
          // Silently handle destruction error
          void destroyErr;
        }
        this.dataSource = this.createDataSource();
        await this.connectWithRetry();
      }
    }
  }

  /**
   * Close the database connection gracefully
   */
  async close(): Promise<void> {
    this.isShuttingDown = true;

    if (!this.dataSource.isInitialized) {
      log.warn(`${this.databaseName} connection not initialized`);
      return;
    }

    await this.dataSource
      .destroy()
      .then(() => log.info(`${this.databaseName} connection closed`))
      .catch((err) =>
        log.error(`Failed to close connection: ${InfrastructureError(err)}`),
      );
  }
}
