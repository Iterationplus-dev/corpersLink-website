import { onMounted, onUnmounted, ref, type Ref } from 'vue';

/**
 * Tracks browser connectivity. Kept in `composables/` (not `features/`)
 * because it's generic enough to be reused by any future feature.
 */
export function useOnlineStatus(): { isOnline: Ref<boolean> } {
  const isOnline = ref(navigator.onLine);

  function handleOnline(): void {
    isOnline.value = true;
  }
  function handleOffline(): void {
    isOnline.value = false;
  }

  onMounted(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  });

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  });

  return { isOnline };
}
