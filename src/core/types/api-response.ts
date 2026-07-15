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
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  code: string;
  errors?: Record<string, string[]>;
}

export interface ApiListQuery {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, string | number | boolean | undefined>;
}
