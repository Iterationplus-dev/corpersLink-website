import { describe, expect, it, vi } from 'vitest';

import type { ApiClient } from '@/core/api/client';
import { ApiEndpoints } from '@/core/constants/api-endpoints';
import type { LegalContentDTO } from '@/features/legal/types';

import { LegalRepository } from './legal.repository.impl';

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

describe('LegalRepository', () => {
  it('getPrivacyContent fetches the privacy endpoint and maps it', async () => {
    const dto: LegalContentDTO = { headline: 'Privacy Policy', subheadline: 'sub', sections: [] };
    const get = vi.fn().mockResolvedValue(dto);
    const repository = new LegalRepository(createFakeClient({ get }));

    const content = await repository.getPrivacyContent();

    expect(get).toHaveBeenCalledWith(ApiEndpoints.privacy.content);
    expect(content.headline).toBe('Privacy Policy');
  });

  it('getTermsContent fetches the terms endpoint and maps it', async () => {
    const dto: LegalContentDTO = {
      headline: 'Terms & Conditions',
      subheadline: 'sub',
      sections: [],
    };
    const get = vi.fn().mockResolvedValue(dto);
    const repository = new LegalRepository(createFakeClient({ get }));

    const content = await repository.getTermsContent();

    expect(get).toHaveBeenCalledWith(ApiEndpoints.terms.content);
    expect(content.headline).toBe('Terms & Conditions');
  });
});
