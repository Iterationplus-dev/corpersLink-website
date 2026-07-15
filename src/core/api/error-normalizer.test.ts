import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';

import { normalizeError } from './error-normalizer';
import { MockHttpError } from './mock/mock-http-error';
import { AppError } from '@/core/types/app-error';

describe('normalizeError', () => {
  it('passes through an existing AppError untouched', () => {
    const original = new AppError({ message: 'already normalized', kind: 'validation' });
    expect(normalizeError(original)).toBe(original);
  });

  it('maps a MockHttpError 422 into a validation AppError with field errors', () => {
    const error = new MockHttpError(422, {
      success: false,
      message: 'Some fields need your attention before continuing.',
      code: 'VALIDATION_ERROR',
      errors: { email: ['Enter a valid email address.'] },
    });

    const result = normalizeError(error);

    expect(result).toBeInstanceOf(AppError);
    expect(result.kind).toBe('validation');
    expect(result.statusCode).toBe(422);
    expect(result.fieldErrors).toEqual({ email: ['Enter a valid email address.'] });
  });

  it('maps a MockHttpError 500 into a server AppError', () => {
    const error = new MockHttpError(500, {
      success: false,
      message: 'boom',
      code: 'INTERNAL_SERVER_ERROR',
    });

    const result = normalizeError(error);
    expect(result.kind).toBe('server');
    expect(result.statusCode).toBe(500);
  });

  it('maps a MockHttpError 404 into a not_found AppError', () => {
    const error = new MockHttpError(404, {
      success: false,
      message: 'missing',
      code: 'NOT_FOUND',
    });

    expect(normalizeError(error).kind).toBe('not_found');
  });

  it('maps an axios timeout (ECONNABORTED) into a timeout AppError', () => {
    const axiosError = new AxiosError('timeout of 15000ms exceeded');
    axiosError.code = 'ECONNABORTED';

    const result = normalizeError(axiosError);
    expect(result.kind).toBe('timeout');
  });

  it('maps an axios 401 response into an unauthorized AppError', () => {
    const axiosError = new AxiosError('Unauthorized');
    axiosError.response = {
      status: 401,
      data: { success: false, message: 'Session expired', code: 'UNAUTHORIZED' },
      statusText: 'Unauthorized',
      headers: {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config: {} as any,
    };

    const result = normalizeError(axiosError);
    expect(result.kind).toBe('unauthorized');
    expect(result.message).toBe('Session expired');
  });

  it('falls back to an unknown AppError for unrecognized error shapes', () => {
    const result = normalizeError('just a string');
    expect(result.kind).toBe('unknown');
  });

  it('wraps a plain Error with its message and unknown kind', () => {
    const result = normalizeError(new Error('plain failure'));
    expect(result.kind).toBe('unknown');
    expect(result.message).toBe('plain failure');
  });
});
