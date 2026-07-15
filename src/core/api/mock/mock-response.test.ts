import { describe, expect, it } from 'vitest';

import { MockHttpError } from './mock-http-error';
import {
  mockError,
  mockNotFoundError,
  mockServerError,
  mockSuccess,
  mockValidationError,
  paginateAndSearch,
} from './mock-response';

describe('mockSuccess', () => {
  it('wraps data in the standard success envelope with request metadata', () => {
    const response = mockSuccess({ hello: 'world' });

    expect(response.success).toBe(true);
    expect(response.data).toEqual({ hello: 'world' });
    expect(response.meta?.requestId).toMatch(/^mock-req-\d+$/);
    expect(response.meta?.timestamp).toBeTruthy();
  });
});

describe('mockError helpers', () => {
  it('mockError throws a MockHttpError carrying status/code/message', () => {
    expect(() => mockError(400, 'bad request', 'BAD_REQUEST')).toThrowError(MockHttpError);

    try {
      mockError(400, 'bad request', 'BAD_REQUEST');
    } catch (error) {
      expect(error).toBeInstanceOf(MockHttpError);
      expect((error as MockHttpError).status).toBe(400);
      expect((error as MockHttpError).payload.code).toBe('BAD_REQUEST');
    }
  });

  it('mockValidationError throws a 422 with field errors attached', () => {
    try {
      mockValidationError({ email: ['Email is required.'] });
      expect.unreachable();
    } catch (error) {
      const httpError = error as MockHttpError;
      expect(httpError.status).toBe(422);
      expect(httpError.payload.errors).toEqual({ email: ['Email is required.'] });
    }
  });

  it('mockServerError throws a 500', () => {
    try {
      mockServerError();
      expect.unreachable();
    } catch (error) {
      expect((error as MockHttpError).status).toBe(500);
    }
  });

  it('mockNotFoundError throws a 404 with the resource name in the message', () => {
    try {
      mockNotFoundError('Institution');
      expect.unreachable();
    } catch (error) {
      const httpError = error as MockHttpError;
      expect(httpError.status).toBe(404);
      expect(httpError.payload.message).toContain('Institution');
    }
  });
});

interface Sample extends Record<string, unknown> {
  id: number;
  name: string;
}

const sampleItems: Sample[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Institution ${i + 1}`,
}));

describe('paginateAndSearch', () => {
  it('defaults to page 1 with 10 items per page', () => {
    const result = paginateAndSearch(sampleItems, {}, ['name']);

    expect(result.items).toHaveLength(10);
    expect(result.pagination).toEqual({ page: 1, perPage: 10, total: 25, totalPages: 3 });
  });

  it('respects explicit page and perPage', () => {
    const result = paginateAndSearch(sampleItems, { page: 2, perPage: 5 }, ['name']);

    expect(result.items[0]?.id).toBe(6);
    expect(result.pagination.page).toBe(2);
    expect(result.pagination.totalPages).toBe(5);
  });

  it('filters by a case-insensitive substring search before paginating', () => {
    const result = paginateAndSearch(sampleItems, { search: 'institution 1' }, ['name']);

    // Matches "Institution 1", "Institution 10".."Institution 19"
    expect(result.pagination.total).toBe(11);
    expect(result.items.every((item) => item.name.toLowerCase().includes('institution 1'))).toBe(
      true,
    );
  });

  it('returns an empty page (not an error) when search matches nothing', () => {
    const result = paginateAndSearch(sampleItems, { search: 'nonexistent' }, ['name']);

    expect(result.items).toEqual([]);
    expect(result.pagination.total).toBe(0);
    expect(result.pagination.totalPages).toBe(1);
  });
});
