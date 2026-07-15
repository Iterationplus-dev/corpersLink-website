import { useAsyncResource } from '@/composables/useAsyncResource';
import { legalService } from '@/features/legal/services';

export function usePrivacyPage() {
  return useAsyncResource(() => legalService.loadPrivacyPage());
}
