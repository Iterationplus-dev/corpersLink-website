import { defineStore } from 'pinia';

import { AppError } from '@/core/types/app-error';
import { logger } from '@/core/utils/logger';
import { siteService } from '@/features/site/services';
import type { SiteChrome } from '@/features/site/types';

interface SiteState {
  chrome: SiteChrome | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: AppError | null;
}

/**
 * Holds the header/footer chrome shared by every route. Fetched once from
 * `DefaultLayout` and consumed by `AppHeader` + `AppFooter` simultaneously —
 * exactly the kind of state that belongs in Pinia rather than a page-local
 * composable.
 */
export const useSiteStore = defineStore('site', {
  state: (): SiteState => ({ chrome: null, status: 'idle', error: null }),

  getters: {
    isLoading: (state): boolean => state.status === 'loading',
    hasError: (state): boolean => state.status === 'error',
    isReady: (state): boolean => state.status === 'success' && state.chrome !== null,
  },

  actions: {
    async fetchChrome(): Promise<void> {
      if (this.status === 'loading' || this.status === 'success') return;

      this.status = 'loading';
      this.error = null;

      try {
        this.chrome = await siteService.loadChrome();
        this.status = 'success';
      } catch (error) {
        const appError =
          error instanceof AppError
            ? error
            : new AppError({ message: 'Failed to load site chrome.', kind: 'unknown' });
        this.error = appError;
        this.status = 'error';
        logger.error('Failed to load site chrome', appError);
      }
    },
  },
});
