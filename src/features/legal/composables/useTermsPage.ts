import { useAsyncResource } from '@/composables/useAsyncResource';
import { legalService } from '@/features/legal/services';

export function useTermsPage() {
  return useAsyncResource(() => legalService.loadTermsPage());
}
