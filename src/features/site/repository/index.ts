import { apiClient } from '@/core/api/client';

import { SiteRepository } from './site.repository.impl';

export type { ISiteRepository } from './site.repository';
export { SiteRepository } from './site.repository.impl';

export const siteRepository = new SiteRepository(apiClient);
