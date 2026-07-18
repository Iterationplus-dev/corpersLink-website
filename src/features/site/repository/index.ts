import { MockApiClient } from '@/core/api/client';

import { SiteRepository } from './site.repository.impl';

export type { ISiteRepository } from './site.repository';
export { SiteRepository } from './site.repository.impl';

/**
 * Always mock, regardless of `VITE_USE_MOCK_API` — nav links and footer
 * chrome have no real backend endpoint.
 */
export const siteRepository = new SiteRepository(new MockApiClient());
