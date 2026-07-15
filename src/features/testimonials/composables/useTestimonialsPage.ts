import { useAsyncResource } from '@/composables/useAsyncResource';
import { testimonialsService } from '@/features/testimonials/services';

export function useTestimonialsPage() {
  return useAsyncResource(() => testimonialsService.loadTestimonialsPage());
}
