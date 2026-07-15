import { useAsyncResource } from '@/composables/useAsyncResource';
import { faqService } from '@/features/faq/services';

export function useFaqPage() {
  return useAsyncResource(() => faqService.loadFaqPage());
}
