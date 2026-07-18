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

  it('maps a real-backend axios 401 response into an unauthorized AppError', () => {
    const axiosError = new AxiosError('Unauthorized');
    axiosError.response = {
      status: 401,
      data: { error: { code: 'unauthenticated', message: 'Session expired' } },
      statusText: 'Unauthorized',
      headers: {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config: {} as any,
    };

    const result = normalizeError(axiosError);
    expect(result.kind).toBe('unauthorized');
    expect(result.message).toBe('Session expired');
    expect(result.code).toBe('unauthenticated');
  });

  it('maps a real-backend 422 response into a validation AppError, grouping fields by name', () => {
    const axiosError = new AxiosError('Unprocessable Entity');
    axiosError.response = {
      status: 422,
      data: {
        error: {
          code: 'validation_error',
          message: 'The email field is required.',
          fields: [
            { field: 'email', message: 'The email field is required.' },
            { field: 'phone', message: 'The phone field is invalid.' },
            { field: 'phone', message: 'The phone field must be unique.' },
          ],
        },
      },
      statusText: 'Unprocessable Entity',
      headers: {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config: {} as any,
    };

    const result = normalizeError(axiosError);
    expect(result.kind).toBe('validation');
    expect(result.fieldErrors).toEqual({
      email: ['The email field is required.'],
      phone: ['The phone field is invalid.', 'The phone field must be unique.'],
    });
  });

  it('maps a real-backend 409 response into a conflict AppError', () => {
    const axiosError = new AxiosError('Conflict');
    axiosError.response = {
      status: 409,
      data: { error: { code: 'seat_unavailable', message: 'That seat was just taken.' } },
      statusText: 'Conflict',
      headers: {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config: {} as any,
    };

    const result = normalizeError(axiosError);
    expect(result.kind).toBe('conflict');
    expect(result.code).toBe('seat_unavailable');
  });

  it('maps a real-backend 410 response into a gone AppError', () => {
    const axiosError = new AxiosError('Gone');
    axiosError.response = {
      status: 410,
      data: { error: { code: 'hold_expired', message: 'This seat hold has expired.' } },
      statusText: 'Gone',
      headers: {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config: {} as any,
    };

    const result = normalizeError(axiosError);
    expect(result.kind).toBe('gone');
    expect(result.code).toBe('hold_expired');
  });

  it('falls back to the default message when a real-backend error response has no body', () => {
    const axiosError = new AxiosError('Server Error');
    axiosError.response = {
      status: 500,
      data: undefined as never,
      statusText: 'Internal Server Error',
      headers: {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config: {} as any,
    };

    const result = normalizeError(axiosError);
    expect(result.kind).toBe('server');
    expect(result.message).toBe('Something went wrong on our end. Please try again shortly.');
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
