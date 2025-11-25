export type AppErrorOptions = {
  status?: number;
  code?: string;
  details?: unknown;
  cause?: unknown;
};

export class AppError extends Error {
  status?: number;
  code?: string;
  details?: unknown;
  cause?: unknown;

  constructor(message: string, opts?: AppErrorOptions) {
    super(message);
    this.name = "AppError";
    Object.defineProperty(this, "status", {
      value: opts?.status,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "code", {
      value: opts?.code,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "details", {
      value: opts?.details,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "cause", {
      value: opts?.cause,
      enumerable: true,
      configurable: true,
    });

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      details: this.details,
    };
  }

  static fromUnknown(error: unknown): AppError {
    if (error instanceof AppError) return error;
    if (error instanceof Error)
      return new AppError(error.message, { cause: error });
    return new AppError(String(error));
  }
}

export default AppError;
