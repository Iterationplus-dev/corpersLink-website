/**
 * Standard success envelope returned by the CorpersLink API for every
 * endpoint. Mirrors the real backend's response contract so mock and real
 * data are interchangeable at the API-client boundary.
 */
export interface ApiSuccessResponse<TData> {
  success: true;
  data: TData;
  meta?: ApiResponseMeta;
}

export interface ApiResponseMeta {
  requestId?: string;
  timestamp?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface PaginatedData<TItem> {
  items: TItem[];
  pagination: PaginationMeta;
}

/**
 * Standard error envelope. `errors` carries field-level validation messages
 * (HTTP 422); `message` is always a human-readable summary.
 *
 * This is the MOCK adapter's own error shape only — kept independent of the
 * real backend's envelope (see `RealApiErrorResponse` below) so mock error
 * factories never need to change just because the real API's shape does.
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  code: string;
  errors?: Record<string, string[]>;
}

/** A single field-level validation failure, as the real backend reports it. */
export interface RealApiErrorField {
  field: string;
  message: string;
}

/**
 * Error envelope returned by the real backend for every non-2xx response:
 * `{"error":{"code","message","fields":[{field,message}]}}`. `fields` is only
 * present on 422 validation failures.
 */
export interface RealApiErrorResponse {
  error: {
    code: string;
    message: string;
    fields?: RealApiErrorField[];
  };
}

export interface ApiListQuery {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, string | number | boolean | undefined>;
}
