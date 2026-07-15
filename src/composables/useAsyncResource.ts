import { computed, onMounted, ref, shallowRef } from 'vue';

import { AppError } from '@/core/types/app-error';
import { logger } from '@/core/utils/logger';

export type ResourceStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Generic "fetch on mount, expose loading/error/retry" wrapper for any
 * page whose data isn't shared across components (i.e. doesn't warrant its
 * own Pinia store) — About, Testimonials, FAQ, Support. The landing page
 * and site chrome use a Pinia store instead because their state is
 * consumed by multiple components at once.
 */
export function useAsyncResource<TData>(loader: () => Promise<TData>) {
  const data = shallowRef<TData | null>(null);
  const status = ref<ResourceStatus>('idle');
  const error = ref<AppError | null>(null);

  async function execute(): Promise<void> {
    status.value = 'loading';
    error.value = null;

    try {
      data.value = await loader();
      status.value = 'success';
    } catch (err) {
      const appError =
        err instanceof AppError
          ? err
          : new AppError({ message: 'Failed to load content.', kind: 'unknown' });
      error.value = appError;
      status.value = 'error';
      logger.error('useAsyncResource failed to load', appError);
    }
  }

  onMounted(() => {
    if (status.value === 'idle') void execute();
  });

  return {
    data,
    isLoading: computed(() => status.value === 'loading'),
    hasError: computed(() => status.value === 'error'),
    isReady: computed(() => status.value === 'success' && data.value !== null),
    error,
    retry: execute,
  };
}
