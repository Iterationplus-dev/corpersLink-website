import { useAsyncResource } from '@/composables/useAsyncResource';
import { supportService } from '@/features/support/services';

export function useSupportPage() {
  return useAsyncResource(() => supportService.loadSupportPage());
}
