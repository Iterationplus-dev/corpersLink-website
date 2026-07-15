import { useAsyncResource } from '@/composables/useAsyncResource';
import { aboutService } from '@/features/about/services';

export function useAboutPage() {
  return useAsyncResource(() => aboutService.loadAboutPage());
}
