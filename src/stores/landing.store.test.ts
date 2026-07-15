import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppError } from '@/core/types/app-error';

const loadLandingPage = vi.fn();

vi.mock('@/features/landing/services', () => ({
  landingService: {
    loadLandingPage: (...args: unknown[]) => loadLandingPage(...args),
  },
}));

// Imported after the mock so the store binds to the mocked service.
const { useLandingStore } = await import('./landing.store');

describe('useLandingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    loadLandingPage.mockReset();
  });

  it('starts in an idle state with empty data', () => {
    const store = useLandingStore();

    expect(store.status).toBe('idle');
    expect(store.hero).toBeNull();
    expect(store.isLoading).toBe(false);
    expect(store.isReady).toBe(false);
  });

  it('transitions idle -> loading -> success and stores the fetched page', async () => {
    const page = {
      hero: { headline: 'x' },
      stats: [{ id: 'a' }],
      steps: [{ stepNumber: 1 }],
    };
    loadLandingPage.mockResolvedValue(page);
    const store = useLandingStore();

    const pending = store.fetchLandingPage();
    expect(store.status).toBe('loading');

    await pending;

    expect(store.status).toBe('success');
    expect(store.isReady).toBe(true);
    expect(store.hero).toEqual(page.hero);
    expect(store.stats).toEqual(page.stats);
    expect(store.error).toBeNull();
  });

  it('transitions to an error state and preserves the AppError on failure', async () => {
    loadLandingPage.mockRejectedValue(new AppError({ message: 'offline', kind: 'network' }));
    const store = useLandingStore();

    await store.fetchLandingPage();

    expect(store.status).toBe('error');
    expect(store.hasError).toBe(true);
    expect(store.error?.kind).toBe('network');
    expect(store.hero).toBeNull();
  });

  it('reset() clears data and returns to idle', async () => {
    loadLandingPage.mockResolvedValue({
      hero: { headline: 'x' },
      stats: [],
      steps: [],
    });
    const store = useLandingStore();
    await store.fetchLandingPage();

    store.reset();

    expect(store.status).toBe('idle');
    expect(store.hero).toBeNull();
  });
});
