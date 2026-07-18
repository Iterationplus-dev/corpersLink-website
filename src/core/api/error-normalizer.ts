import { isAxiosError } from 'axios';

import { HttpStatus } from '@/core/constants/http-status';
import { MockHttpError } from '@/core/api/mock/mock-http-error';
import type { RealApiErrorField, RealApiErrorResponse } from '@/core/types/api-response';
import { AppError, type AppErrorKind } from '@/core/types/app-error';

function kindFromStatus(status: number | undefined): AppErrorKind {
  switch (status) {
    case HttpStatus.UNAUTHORIZED:
      return 'unauthorized';
    case HttpStatus.FORBIDDEN:
      return 'forbidden';
    case HttpStatus.NOT_FOUND:
      return 'not_found';
    case HttpStatus.CONFLICT:
      return 'conflict';
    case HttpStatus.GONE:
      return 'gone';
    case HttpStatus.UNPROCESSABLE_ENTITY:
      return 'validation';
    case HttpStatus.TOO_MANY_REQUESTS:
      return 'rate_limited';
    case undefined:
      return 'network';
    default:
      return status >= 500 ? 'server' : 'unknown';
  }
}

const DEFAULT_MESSAGES: Record<AppErrorKind, string> = {
  validation: 'Some fields need your attention before continuing.',
  unauthorized: 'Your session has expired. Please sign in again.',
  forbidden: "You don't have permission to do that.",
  not_found: 'The requested resource could not be found.',
  conflict: 'That was just taken. Please try again.',
  gone: 'This has expired. Please start over.',
  rate_limited: 'Too many requests. Please wait a moment and try again.',
  server: 'Something went wrong on our end. Please try again shortly.',
  network: 'Unable to reach CorpersLink. Check your connection and try again.',
  timeout: 'The request took too long to respond. Please try again.',
  offline: "You're offline. We'll use cached data where possible.",
  unknown: 'An unexpected error occurred.',
};

/** Groups the real backend's `fields: [{field, message}]` array into the
 * `Record<field, string[]>` shape `AppError.fieldErrors` already expects. */
function toFieldErrors(fields?: RealApiErrorField[]): Record<string, string[]> | undefined {
  if (!fields || fields.length === 0) {
    return undefined;
  }

  return fields.reduce<Record<string, string[]>>((acc, { field, message }) => {
    (acc[field] ??= []).push(message);
    return acc;
  }, {});
}

/**
 * Converts any error thrown by axios (real backend) or the mock adapter into
 * a single normalized `AppError`, so downstream code never branches on
 * "is this a mock error or a real one".
 */
export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (!navigator.onLine) {
    return new AppError({ message: DEFAULT_MESSAGES.offline, kind: 'offline' });
  }

  if (error instanceof MockHttpError) {
    const kind = kindFromStatus(error.status);
    return new AppError({
      message: error.payload.message ?? DEFAULT_MESSAGES[kind],
      kind,
      statusCode: error.status,
      code: error.payload.code,
      fieldErrors: error.payload.errors,
    });
  }

  if (isAxiosError<RealApiErrorResponse>(error)) {
    if (error.code === 'ECONNABORTED') {
      return new AppError({ message: DEFAULT_MESSAGES.timeout, kind: 'timeout' });
    }

    const status = error.response?.status;
    const kind = kindFromStatus(status);
    const payload = error.response?.data;

    return new AppError({
      message: payload?.error?.message ?? DEFAULT_MESSAGES[kind],
      kind,
      statusCode: status,
      code: payload?.error?.code,
      fieldErrors: toFieldErrors(payload?.error?.fields),
    });
  }

  if (error instanceof Error) {
    return new AppError({ message: error.message || DEFAULT_MESSAGES.unknown, kind: 'unknown' });
  }

  return new AppError({ message: DEFAULT_MESSAGES.unknown, kind: 'unknown' });
}
