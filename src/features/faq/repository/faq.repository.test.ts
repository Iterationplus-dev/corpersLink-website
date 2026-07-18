import { describe, expect, it, vi } from 'vitest';

import type { ApiClient } from '@/core/api/client';
import { ApiEndpoints } from '@/core/constants/api-endpoints';
import type { FaqItemDTO } from '@/features/faq/types';

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
  it('getItems fetches the faq list endpoint and maps every item', async () => {
    const dtos: FaqItemDTO[] = [{ id: 1, question: 'Q?', answer: 'A.', category: 'booking' }];
    const get = vi.fn().mockResolvedValue(dtos);
    const repository = new FaqRepository(createFakeClient({ get }));

    const items = await repository.getItems();

    expect(get).toHaveBeenCalledWith(ApiEndpoints.faq.list);
    expect(items).toEqual(dtos);
  });
});
