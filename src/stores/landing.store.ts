import { defineStore } from 'pinia';

import { landingService } from '@/features/landing/services';
import type { HeroStat, HowItWorksStep, LandingHeroContent } from '@/features/landing/types';
import { AppError } from '@/core/types/app-error';
import { logger } from '@/core/utils/logger';

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

interface LandingState {
  hero: LandingHeroContent | null;
  stats: HeroStat[];
  steps: HowItWorksStep[];
  status: RequestStatus;
  error: AppError | null;
}

/**
 * Holds the *API state* for the landing feature (what was fetched, is it
 * loading, did it fail). UI-only concerns (form inputs, hover state) stay in
 * component-local composables — see `useNewsletterForm`.
 */
export const useLandingStore = defineStore('landing', {
  state: (): LandingState => ({
    hero: null,
    stats: [],
    steps: [],
    status: 'idle',
    error: null,
  }),

  getters: {
    isLoading: (state): boolean => state.status === 'loading',
    hasError: (state): boolean => state.status === 'error',
    isReady: (state): boolean => state.status === 'success' && state.hero !== null,
  },

  actions: {
    async fetchLandingPage(): Promise<void> {
      this.status = 'loading';
      this.error = null;

      try {
        const page = await landingService.loadLandingPage();
        this.hero = page.hero;
        this.stats = page.stats;
        this.steps = page.steps;
        this.status = 'success';
      } catch (error) {
        const appError =
          error instanceof AppError
            ? error
            : new AppError({
                message: 'Failed to load landing page content.',
                kind: 'unknown',
              });
        this.error = appError;
        this.status = 'error';
        logger.error('Failed to load landing page', appError);
      }
    },

    reset(): void {
      this.hero = null;
      this.stats = [];
      this.steps = [];
      this.status = 'idle';
      this.error = null;
    },
  },
});
