import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import { useLandingStore } from '@/stores/landing.store';

/**
 * Component-facing entry point for the landing page. Fetches on first use
 * and exposes everything a view needs — data, loading/error flags, and a
 * `retry` action for the error state's "Try again" button.
 */
export function useLandingPage() {
  const store = useLandingStore();
  const { hero, stats, steps, isLoading, hasError, isReady, error } = storeToRefs(store);

  onMounted(() => {
    if (store.status === 'idle') {
      void store.fetchLandingPage();
    }
  });

  async function retry(): Promise<void> {
    await store.fetchLandingPage();
  }

  return { hero, stats, steps, isLoading, hasError, isReady, error, retry };
}
