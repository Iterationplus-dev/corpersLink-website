/**
 * Centralized, type-safe access to build-time environment variables.
 *
 * This is the ONLY module in the codebase that should read `import.meta.env`
 * directly. Everything else (API client, mock toggles, feature flags) reads
 * from `env` so behavior stays consistent and testable.
 */

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') return fallback;
  return value.trim().toLowerCase() === 'true';
}

function parseNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export interface AppEnvironment {
  /** Base URL for the real CorpersLink REST API. */
  apiBaseUrl: string;
  /** When true, all repositories are served by the in-memory mock backend. */
  useMockApi: boolean;
  /** Artificial latency (ms) added to mock responses to emulate a real network. */
  mockLatencyMs: number;
  /** Request timeout (ms) for the HTTP client. */
  apiTimeoutMs: number;
  /** Current Vite mode (development, production, test...). */
  mode: string;
  isDev: boolean;
  isProd: boolean;
}

/**
 * Defaults to mock mode when env vars are absent so the app runs immediately
 * after a fresh clone with zero configuration.
 */
export const env: AppEnvironment = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://corpslink-api.test/api/v1',
  useMockApi: parseBoolean(import.meta.env.VITE_USE_MOCK_API, true),
  mockLatencyMs: parseNumber(import.meta.env.VITE_MOCK_LATENCY_MS, 450),
  apiTimeoutMs: parseNumber(import.meta.env.VITE_API_TIMEOUT_MS, 15000),
  mode: import.meta.env.MODE ?? 'development',
  isDev: import.meta.env.DEV ?? true,
  isProd: import.meta.env.PROD ?? false,
};
