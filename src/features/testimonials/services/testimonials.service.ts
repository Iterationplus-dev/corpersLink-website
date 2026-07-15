import type { ITestimonialsRepository } from '@/features/testimonials/repository';
import type { TestimonialsContent } from '@/features/testimonials/types';

export class TestimonialsService {
  constructor(private readonly repository: ITestimonialsRepository) {}

  async loadTestimonialsPage(): Promise<TestimonialsContent> {
    return this.repository.getContent();
  }
}
