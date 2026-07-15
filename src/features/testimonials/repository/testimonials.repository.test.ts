import { describe, expect, it, vi } from 'vitest';

import type { ApiClient } from '@/core/api/client';
import { ApiEndpoints } from '@/core/constants/api-endpoints';
import type { TestimonialsContentDTO } from '@/features/testimonials/types';

import { TestimonialsRepository } from './testimonials.repository.impl';

function createFakeClient(overrides: Partial<ApiClient> = {}): ApiClient {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  };
}

describe('TestimonialsRepository', () => {
  it('getContent fetches the testimonials endpoint and maps it', async () => {
    const dto: TestimonialsContentDTO = {
      eyebrow: 'Testimonials',
      headline: 'headline',
      rating_summary: 'summary',
      testimonials: [],
    };
    const get = vi.fn().mockResolvedValue(dto);
    const repository = new TestimonialsRepository(createFakeClient({ get }));

    const content = await repository.getContent();

    expect(get).toHaveBeenCalledWith(ApiEndpoints.testimonials.content);
    expect(content.headline).toBe('headline');
  });
});
