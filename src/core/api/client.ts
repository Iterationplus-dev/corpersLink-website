import type { AxiosInstance } from 'axios';

import { env } from '@/core/config/env';
import type { ApiSuccessResponse } from '@/core/types/api-response';

import { httpClient } from './axios';
import { normalizeError } from './error-normalizer';
import { dispatchMockRequest } from './mock';
import type { HttpMethod } from './mock/mock-router';

export interface ApiRequestConfig {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

/**
 * The only HTTP abstraction the rest of the app is allowed to depend on.
 * Repositories are written against this interface, never against axios or
 * the mock router directly — that's what makes swapping backends a
 * one-line environment change instead of a code change.
 */
export interface ApiClient {
  get<TData>(url: string, config?: ApiRequestConfig): Promise<TData>;
  post<TData>(url: string, body?: unknown, config?: ApiRequestConfig): Promise<TData>;
  put<TData>(url: string, body?: unknown, config?: ApiRequestConfig): Promise<TData>;
  patch<TData>(url: string, body?: unknown, config?: ApiRequestConfig): Promise<TData>;
  delete<TData>(url: string, body?: unknown, config?: ApiRequestConfig): Promise<TData>;
}

class HttpApiClient implements ApiClient {
  constructor(private readonly axiosInstance: AxiosInstance) {}

  private async request<TData>(
    method: HttpMethod,
    url: string,
    body?: unknown,
    config?: ApiRequestConfig,
  ): Promise<TData> {
    try {
      // The real backend returns the payload directly — no `{data: ...}`
      // envelope — and returns literal JSON `null` for many "done, nothing
      // to return" actions (logout, resend-otp, etc.), which this passes
      // through as-is rather than drilling into a `.data` that doesn't exist.
      const response = await this.axiosInstance.request<TData>({
        method,
        url,
        data: body,
        params: config?.params,
        headers: config?.headers,
      });
      return response.data;
    } catch (error) {
      throw normalizeError(error);
    }
  }

  get<TData>(url: string, config?: ApiRequestConfig): Promise<TData> {
    return this.request<TData>('get', url, undefined, config);
  }

  post<TData>(url: string, body?: unknown, config?: ApiRequestConfig): Promise<TData> {
    return this.request<TData>('post', url, body, config);
  }

  put<TData>(url: string, body?: unknown, config?: ApiRequestConfig): Promise<TData> {
    return this.request<TData>('put', url, body, config);
  }

  patch<TData>(url: string, body?: unknown, config?: ApiRequestConfig): Promise<TData> {
    return this.request<TData>('patch', url, body, config);
  }

  delete<TData>(url: string, body?: unknown, config?: ApiRequestConfig): Promise<TData> {
    return this.request<TData>('delete', url, body, config);
  }
}

class MockApiClient implements ApiClient {
  private async request<TData>(
    method: HttpMethod,
    url: string,
    body?: unknown,
    config?: ApiRequestConfig,
  ): Promise<TData> {
    try {
      const response = (await dispatchMockRequest(method, url, {
        query: config?.params,
        body,
      })) as ApiSuccessResponse<TData>;
      return response.data;
    } catch (error) {
      throw normalizeError(error);
    }
  }

  get<TData>(url: string, config?: ApiRequestConfig): Promise<TData> {
    return this.request<TData>('get', url, undefined, config);
  }

  post<TData>(url: string, body?: unknown, config?: ApiRequestConfig): Promise<TData> {
    return this.request<TData>('post', url, body, config);
  }

  put<TData>(url: string, body?: unknown, config?: ApiRequestConfig): Promise<TData> {
    return this.request<TData>('put', url, body, config);
  }

  patch<TData>(url: string, body?: unknown, config?: ApiRequestConfig): Promise<TData> {
    return this.request<TData>('patch', url, body, config);
  }

  delete<TData>(url: string, body?: unknown, config?: ApiRequestConfig): Promise<TData> {
    return this.request<TData>('delete', url, body, config);
  }
}

/**
 * Single entry point used by every repository in the app.
 * Toggle `VITE_USE_MOCK_API` to switch implementations — nothing else changes.
 */
export const apiClient: ApiClient = env.useMockApi
  ? new MockApiClient()
  : new HttpApiClient(httpClient);

/** Exposed for tests that need to construct a client against a fake axios instance. */
export { HttpApiClient, MockApiClient };
