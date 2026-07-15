import type { ApiErrorResponse } from '@/core/types/api-response';

/**
 * Thrown by mock route handlers to emulate a failed HTTP response. Shaped
 * just enough like an axios error that `normalizeError` can treat it
 * identically to a real backend failure.
 */
export class MockHttpError extends Error {
  public readonly status: number;
  public readonly payload: ApiErrorResponse;

  constructor(status: number, payload: ApiErrorResponse) {
    super(payload.message);
    this.name = 'MockHttpError';
    this.status = status;
    this.payload = payload;
  }
}
