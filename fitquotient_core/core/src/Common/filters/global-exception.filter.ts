import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { snakeCase } from 'lodash';
import { log } from '../utilities';
import { InfrastructureError } from '../infrastructure';

interface ValidationErrorDetail {
  field: string;
  message: string;
}

interface ExceptionContext {
  statusCode: number;
  message: string;
  details?: ValidationErrorDetail[];
}

interface CustomException {
  statusCode?: number;
  message?: string;
  details?: Array<{ field?: string; message?: string }>;
}

interface ValidationException {
  getStatus?: () => number;
  message?: string;
  getResponse?: () => unknown;
}

interface ValidationErrorItem {
  property?: string;
  constraints?: Record<string, string>;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private parseCustomException(exception: unknown): ExceptionContext | null {
    const err = exception as CustomException;
    if (!err.statusCode || !err.message) return null;

    return {
      statusCode: err.statusCode,
      message: err.message,
      details: err.details?.map((d) => ({
        field: snakeCase(d.field ?? 'unknown'),
        message:
          (d.message ?? 'Unknown error').replace(
            new RegExp(d.field ?? '', 'g'),
            snakeCase(d.field ?? ''),
          ) ?? 'Unknown error',
      })),
    };
  }

  private parseValidationException(
    exception: unknown,
  ): ExceptionContext | null {
    const err = exception as ValidationException;
    if (!err.getStatus) return null;

    const statusCode = err.getStatus();
    const message = err.message ?? 'Validation error';
    const exceptionResponse = err.getResponse?.();

    if (
      !exceptionResponse ||
      typeof exceptionResponse !== 'object' ||
      !('message' in exceptionResponse) ||
      !Array.isArray(exceptionResponse.message)
    ) {
      return { statusCode, message };
    }

    const details = (exceptionResponse.message as unknown[]).map(
      (err: unknown, index: number) => this.parseValidationError(err, index),
    );

    return { statusCode, message, details };
  }

  private parseValidationError(
    err: unknown,
    index: number,
  ): ValidationErrorDetail {
    // Case 1: simple string message like "fullName should not be empty"
    if (typeof err === 'string') {
      const fieldMatch = err.match(/^(\w+)\s/);
      const rawField = fieldMatch ? fieldMatch[1] : `field_${index}`;

      return {
        field: snakeCase(rawField),
        message: err.replace(rawField, snakeCase(rawField)),
      };
    }

    // Case 2: structured validation error with property + constraints
    const errObj = err as ValidationErrorItem;
    const rawField = errObj.property ?? `field_${index}`;
    const constraintMessage = Object.values(errObj.constraints ?? {}).join(
      ', ',
    );

    return {
      field: snakeCase(rawField),
      message: constraintMessage.replace(rawField, snakeCase(rawField)),
    };
  }

  private parseUnhandledException(exception: unknown): ExceptionContext {
    const errorMessage = InfrastructureError(exception);
    const stackTrace = exception instanceof Error ? exception.stack : '';
    log.error(`Unhandled exception: ${errorMessage}`, stackTrace);

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };
  }

  private logError(statusCode: number, message: string): void {
    if (statusCode >= 500) {
      log.error(`${statusCode} Error: ${message}`);
    }
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    // Try to parse exception in order of priority
    const context =
      this.parseCustomException(exception) ||
      this.parseValidationException(exception) ||
      this.parseUnhandledException(exception);

    // Log the error
    this.logError(context.statusCode, context.message);

    // Build unified error response format
    const errorResponse = {
      is_success: false,
      message: context.message,
      ...(context.details && { details: context.details }),
    };

    // Send formatted error response
    response.code(context.statusCode).send(errorResponse);
  }
}
