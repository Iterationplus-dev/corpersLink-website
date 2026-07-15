import { env } from '@/core/config/env';

/* eslint-disable no-console */

type LogPayload = unknown;

/**
 * Thin logging facade. Centralizing this means we can later swap in
 * Sentry/LogRocket/etc. by editing a single file instead of every call site.
 */
export const logger = {
  debug(message: string, ...payload: LogPayload[]): void {
    if (env.isDev) console.debug(`[debug] ${message}`, ...payload);
  },
  info(message: string, ...payload: LogPayload[]): void {
    if (env.isDev) console.info(`[info] ${message}`, ...payload);
  },
  warn(message: string, ...payload: LogPayload[]): void {
    console.warn(`[warn] ${message}`, ...payload);
  },
  error(message: string, ...payload: LogPayload[]): void {
    console.error(`[error] ${message}`, ...payload);
  },
};
