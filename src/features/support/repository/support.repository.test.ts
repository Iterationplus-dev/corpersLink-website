import { describe, expect, it, vi } from 'vitest';

import type { ApiClient } from '@/core/api/client';
import { ApiEndpoints } from '@/core/constants/api-endpoints';
import type { SupportContentDTO } from '@/features/support/types';

import { SupportRepository } from './support.repository.impl';

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

describe('SupportRepository', () => {
  it('getContent fetches the support endpoint and maps it', async () => {
    const dto: SupportContentDTO = {
      headline: 'How can we help?',
      subheadline: 'sub',
      faq_preview: [],
      contact: { institution_name: 'UNILAG', hours: 'hours', phone: 'phone', email: 'email' },
      refund_notice: 'notice',
    };
    const get = vi.fn().mockResolvedValue(dto);
    const repository = new SupportRepository(createFakeClient({ get }));

    const content = await repository.getContent();

    expect(get).toHaveBeenCalledWith(ApiEndpoints.support.content);
    expect(content.contact.institutionName).toBe('UNILAG');
  });
});
