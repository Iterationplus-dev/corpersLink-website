import axios, { type AxiosInstance } from 'axios';

import { env } from '@/core/config/env';

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
    const token = localStorage.getItem('corperslink.auth.token');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  });

  return instance;
}

export const httpClient = createAxiosInstance();
