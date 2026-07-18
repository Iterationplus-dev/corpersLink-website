/**
 * Single source of truth for where the auth bearer token lives. The real
 * backend's `accessToken`/`refreshToken` are the same opaque Sanctum token
 * under the hood (see auth.store.ts), so only one value is ever persisted.
 */
const TOKEN_STORAGE_KEY = 'corperslink.auth.token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}
