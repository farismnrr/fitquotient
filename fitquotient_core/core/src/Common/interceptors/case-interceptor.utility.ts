import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { snakeCase, camelCase } from 'lodash';

function keysToCamelCase(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(keysToCamelCase);
  if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce<Record<string, unknown>>(
      (acc, [key, value]) => {
        acc[camelCase(key)] = keysToCamelCase(value);
        return acc;
      },
      {},
    );
  }
  return obj;
}

function keysToSnakeCase(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(keysToSnakeCase);
  if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce<Record<string, unknown>>(
      (acc, [key, value]) => {
        acc[snakeCase(key)] = keysToSnakeCase(value);
        return acc;
      },
      {},
    );
  }
  return obj;
}

@Injectable()
export class CaseTransformerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context
      .switchToHttp()
      .getRequest<{ body?: unknown; headers?: Record<string, string> }>();

    // Skip case transformation for multipart requests
    const contentType = req.headers?.['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
      return next.handle().pipe(map((data) => keysToSnakeCase(data)));
    }

    if (req.body !== undefined) {
      req.body = keysToCamelCase(req.body); // Transform request JSON from snake_case -> camelCase
    }

    return next.handle().pipe(map((data) => keysToSnakeCase(data))); // Transform response from camelCase -> snake_case
  }
}
