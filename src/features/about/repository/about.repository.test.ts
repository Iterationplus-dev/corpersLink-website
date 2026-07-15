import { describe, expect, it, vi } from 'vitest';

import type { ApiClient } from '@/core/api/client';
import { ApiEndpoints } from '@/core/constants/api-endpoints';
import type { AboutContentDTO } from '@/features/about/types';

import { AboutRepository } from './about.repository.impl';

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

describe('AboutRepository', () => {
  it('getContent fetches the about content endpoint and maps it', async () => {
    const dto: AboutContentDTO = {
      eyebrow: 'About CorpersLink',
      headline: 'headline',
      body: 'body',
      values: [],
      stats: [],
    };
    const get = vi.fn().mockResolvedValue(dto);
    const repository = new AboutRepository(createFakeClient({ get }));

    const content = await repository.getContent();

    expect(get).toHaveBeenCalledWith(ApiEndpoints.about.content);
    expect(content.headline).toBe('headline');
  });
});
