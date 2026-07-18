import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import { AppError } from '@/core/types/app-error';
import { institutionsService } from '@/features/institutions/services';
import type { Institution } from '@/features/institutions/types';

const SEARCH_DEBOUNCE_MS = 300;

export function useInstitutionsSearch() {
  const query = ref('');
  const institutions = ref<Institution[]>([]);
  const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle');
  const error = ref<AppError | null>(null);
  let debounceId: ReturnType<typeof setTimeout> | null = null;
  let requestId = 0;

  async function runSearch(): Promise<void> {
    const thisRequestId = ++requestId;
    status.value = 'loading';
    error.value = null;
    try {
      const results = await institutionsService.search(query.value);
      // Discard this response if a newer search has since been issued —
      // otherwise a slower earlier request can resolve later and clobber
      // fresher results (e.g. the mount-time fetch resolving after a
      // debounced keystroke search when the user types immediately).
      if (thisRequestId !== requestId) return;
      institutions.value = results;
      status.value = 'success';
    } catch (err) {
      if (thisRequestId !== requestId) return;
      error.value =
        err instanceof AppError
          ? err
          : new AppError({ message: 'Search failed.', kind: 'unknown' });
      status.value = 'error';
    }
  }

  onMounted(runSearch);

  // Live search-as-you-type, debounced so we don't fire a request per keystroke.
  watch(query, () => {
    if (debounceId !== null) clearTimeout(debounceId);
    debounceId = setTimeout(() => {
      void runSearch();
    }, SEARCH_DEBOUNCE_MS);
  });

  onUnmounted(() => {
    if (debounceId !== null) clearTimeout(debounceId);
  });

  const isLoading = computed(() => status.value === 'loading');
  const hasError = computed(() => status.value === 'error');
  const hasNoResults = computed(
    () =>
      status.value === 'success' &&
      institutions.value.length === 0 &&
      query.value.trim().length > 0,
  );

  function clearSearch(): void {
    query.value = '';
    void runSearch();
  }

  return {
    query,
    institutions,
    isLoading,
    hasError,
    hasNoResults,
    error,
    search: runSearch,
    clearSearch,
  };
}
