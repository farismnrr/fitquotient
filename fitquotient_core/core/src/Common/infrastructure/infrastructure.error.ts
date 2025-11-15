export function InfrastructureError(error: unknown): string {
  if (!error) return 'Unknown error';

  // Case 1: AggregateError (contains array of inner errors)
  if (error instanceof AggregateError) {
    const inner = error.errors ?? [];
    const messages = inner.map((e) => InfrastructureError(e)).filter(Boolean);
    return messages.length ? messages.join(' | ') : 'AggregateError';
  }

  // Case 2: Standard Error
  if (error instanceof Error) {
    return error.message || error.name || 'Unknown Error';
  }

  // Case 3: Common DB/driver objects
  if (typeof error === 'object') {
    const errObj = error as Record<string, unknown>;
    const possibleKeys = [
      'message',
      'detail',
      'code',
      'errno',
      'syscall',
      'stack',
    ];
    const found = possibleKeys
      .map((k) => String(errObj[k]))
      .filter((v) => v !== 'undefined' && v);

    if (found.length > 0) return found.join(' | ');
    try {
      return JSON.stringify(error);
    } catch {
      return '[Object]';
    }
  }

  // Case 4: String or other primitives
  if (typeof error === 'string') return error;
  if (typeof error === 'number') return String(error);
  if (typeof error === 'boolean') return String(error);

  return '[Unknown]';
}
