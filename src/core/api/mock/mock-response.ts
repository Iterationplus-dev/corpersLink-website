import { HttpStatus } from '@/core/constants/http-status';
import type {
  ApiErrorResponse,
  ApiListQuery,
  ApiSuccessResponse,
  PaginatedData,
  PaginationMeta,
} from '@/core/types/api-response';

import { MockHttpError } from './mock-http-error';

let requestCounter = 0;

export function mockSuccess<TData>(
  data: TData,
  meta?: { pagination?: PaginationMeta },
): ApiSuccessResponse<TData> {
  requestCounter += 1;
  return {
    success: true,
    data,
    meta: {
      requestId: `mock-req-${requestCounter}`,
      timestamp: new Date().toISOString(),
      pagination: meta?.pagination,
    },
  };
}

export function mockError(
  status: number,
  message: string,
  code: string,
  errors?: Record<string, string[]>,
): never {
  const payload: ApiErrorResponse = { success: false, message, code, errors };
  throw new MockHttpError(status, payload);
}

export function mockValidationError(errors: Record<string, string[]>): never {
  return mockError(
    HttpStatus.UNPROCESSABLE_ENTITY,
    'Some fields need your attention before continuing.',
    'VALIDATION_ERROR',
    errors,
  );
}

export function mockServerError(
  message = 'Something went wrong on our end. Please try again shortly.',
): never {
  return mockError(HttpStatus.INTERNAL_SERVER_ERROR, message, 'INTERNAL_SERVER_ERROR');
}

export function mockNotFoundError(resource: string): never {
  return mockError(HttpStatus.NOT_FOUND, `${resource} could not be found.`, 'NOT_FOUND');
}

/**
 * Applies a naive case-insensitive substring search across the given fields,
 * then paginates the result — mirrors how the real backend's list endpoints
 * behave so composables/components can rely on the same `meta.pagination`.
 */
export function paginateAndSearch<TItem extends Record<string, unknown>>(
  items: TItem[],
  query: ApiListQuery,
  searchableFields: Array<keyof TItem>,
): PaginatedData<TItem> {
  const page = query.page && query.page > 0 ? query.page : 1;
  const perPage = query.perPage && query.perPage > 0 ? query.perPage : 10;

  let filtered = items;
  if (query.search && query.search.trim().length > 0) {
    const needle = query.search.trim().toLowerCase();
    filtered = filtered.filter((item) =>
      searchableFields.some((field) =>
        String(item[field] ?? '')
          .toLowerCase()
          .includes(needle),
      ),
    );
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  return {
    items: pageItems,
    pagination: { page, perPage, total, totalPages },
  };
}
