export type AppErrorKind =
  | 'validation'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'rate_limited'
  | 'server'
  | 'network'
  | 'timeout'
  | 'offline'
  | 'unknown';

/**
 * Normalized error shape used across the entire application. Every layer
 * (API client, repository, composable, component) deals exclusively with
 * `AppError` instances — raw Axios/mock errors never leak past the API layer.
 */
export class AppError extends Error {
  public readonly kind: AppErrorKind;
  public readonly statusCode?: number;
  public readonly code: string;
  public readonly fieldErrors?: Record<string, string[]>;

  constructor(params: {
    message: string;
    kind: AppErrorKind;
    statusCode?: number;
    code?: string;
    fieldErrors?: Record<string, string[]>;
  }) {
    super(params.message);
    this.name = 'AppError';
    this.kind = params.kind;
    this.statusCode = params.statusCode;
    this.code = params.code ?? params.kind.toUpperCase();
    this.fieldErrors = params.fieldErrors;
  }

  get isRetryable(): boolean {
    return this.kind === 'network' || this.kind === 'timeout' || this.kind === 'server';
  }
}
