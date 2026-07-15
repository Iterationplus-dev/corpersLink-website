import type { TestimonialsContent } from '@/features/testimonials/types';

export interface ITestimonialsRepository {
  getContent(): Promise<TestimonialsContent>;
}
