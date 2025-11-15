import { Logger } from '@nestjs/common';
import * as path from 'path';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class AppLogger {
  private readonly logger: Logger;
  private readonly isDev: boolean;
  private readonly logLevels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor() {
    this.logger = new Logger('App');
    this.isDev = process.env.NODE_ENV === 'development';
  }

  private getLogLevel(): LogLevel {
    const level = (process.env.LOG_LEVEL?.toLowerCase() || 'info') as LogLevel;

    if (level in this.logLevels) {
      return level;
    }

    return 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    const currentLogLevel = this.getLogLevel();
    return this.logLevels[level] >= this.logLevels[currentLogLevel];
  }

  private getContext(): string {
    if (!this.isDev) return '';

    const stack = new Error().stack?.split('\n') ?? [];

    const callerLine =
      stack.find(
        (line) =>
          (line.includes('.ts') || line.includes('.js')) &&
          !line.includes('logger.utility'),
      ) || 'unknown';

    const filename = path.basename(callerLine.split('(').pop() || '', ')');
    const name = filename.replace(/\.(ts|js).*$/, '').trim();
    const parts = name
      .split('.')
      .filter(Boolean)
      .map((p) => this.capitalize(p))
      .reverse();

    return `[${parts.join(' | ')}]`;
  }

  private capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private formatMessage(message: string): string {
    const context = this.getContext();
    return context ? `${context} ${message}` : message;
  }

  info(message: string) {
    if (this.shouldLog('info')) {
      this.logger.log(this.formatMessage(message));
    }
  }

  warn(message: string) {
    if (this.shouldLog('warn')) {
      this.logger.warn(this.formatMessage(message));
    }
  }

  error(message: string, trace?: string) {
    if (this.shouldLog('error')) {
      this.logger.error(this.formatMessage(message), trace);
    }
  }

  debug(message: string) {
    if (this.shouldLog('debug')) {
      this.logger.debug(this.formatMessage(message));
    }
  }
}

export const log = new AppLogger();
