import { useAsyncResource } from '@/composables/useAsyncResource';
import { accountService } from '@/features/account/services';

export function useAccountPage() {
  return useAsyncResource(() => accountService.loadProfile());
}
