import axios, { isAxiosError, type AxiosInstance } from 'axios';

import { getToken, clearToken } from '@/core/auth/token-storage';
import { env } from '@/core/config/env';
import { HttpStatus } from '@/core/constants/http-status';

/** Fired on any real 401 so app-level code (main.ts) can react without this
 * module importing the Pinia store directly (that would be circular: the
 * store -> service -> repository -> client -> axios chain loops back here). */
export const SESSION_EXPIRED_EVENT = 'corperslink:session-expired';

/**
 * Raw axios instance used only when talking to the real backend
 * (`VITE_USE_MOCK_API=false`). Nothing outside `core/api` should import this
 * directly — go through `apiClient` instead.
 */
export function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: env.apiBaseUrl,
    timeout: env.apiTimeoutMs,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (isAxiosError(error) && error.response?.status === HttpStatus.UNAUTHORIZED) {
        clearToken();
        window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
      }
      return Promise.reject(error);
    },
  );

  return instance;
}

export const httpClient = createAxiosInstance();
