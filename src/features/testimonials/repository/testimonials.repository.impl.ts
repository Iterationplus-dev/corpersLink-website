import type { ApiClient } from '@/core/api/client';
import { ApiEndpoints } from '@/core/constants/api-endpoints';
import { mapTestimonialsContent } from '@/features/testimonials/mappers/testimonials.mapper';
import type { TestimonialsContent, TestimonialsContentDTO } from '@/features/testimonials/types';

import type { ITestimonialsRepository } from './testimonials.repository';

export class TestimonialsRepository implements ITestimonialsRepository {
  constructor(private readonly client: ApiClient) {}

  async getContent(): Promise<TestimonialsContent> {
    const dto = await this.client.get<TestimonialsContentDTO>(ApiEndpoints.testimonials.content);
    return mapTestimonialsContent(dto);
  }
}
