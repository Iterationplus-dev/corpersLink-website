import { describe, expect, it, vi } from 'vitest';

import type { ApiClient } from '@/core/api/client';
import { ApiEndpoints } from '@/core/constants/api-endpoints';
import type { FaqContentDTO } from '@/features/faq/types';

import { FaqRepository } from './faq.repository.impl';

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

describe('FaqRepository', () => {
  it('getContent fetches the faq endpoint and maps it', async () => {
    const dto: FaqContentDTO = { headline: 'FAQ', subheadline: 'sub', items: [] };
    const get = vi.fn().mockResolvedValue(dto);
    const repository = new FaqRepository(createFakeClient({ get }));

    const content = await repository.getContent();

    expect(get).toHaveBeenCalledWith(ApiEndpoints.faq.content);
    expect(content.headline).toBe('FAQ');
  });
});
