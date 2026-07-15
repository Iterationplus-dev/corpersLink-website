import { describe, expect, it, vi } from 'vitest';

import type { ApiClient } from '@/core/api/client';
import { ApiEndpoints } from '@/core/constants/api-endpoints';
import type { SiteChromeDTO } from '@/features/site/types';

import { SiteRepository } from './site.repository.impl';

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

describe('SiteRepository', () => {
  it('getChrome fetches the chrome endpoint and maps it', async () => {
    const dto: SiteChromeDTO = {
      nav_links: [{ label: 'Home', href: '/' }],
      footer_disclaimer: 'disclaimer',
      footer_copyright: 'copyright',
    };
    const get = vi.fn().mockResolvedValue(dto);
    const repository = new SiteRepository(createFakeClient({ get }));

    const chrome = await repository.getChrome();

    expect(get).toHaveBeenCalledWith(ApiEndpoints.site.chrome);
    expect(chrome.navLinks).toEqual([{ label: 'Home', href: '/' }]);
    expect(chrome.footerDisclaimer).toBe('disclaimer');
  });
});
