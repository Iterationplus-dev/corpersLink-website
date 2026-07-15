import { siteRepository } from '@/features/site/repository';

import { SiteService } from './site.service';

export { SiteService } from './site.service';

export const siteService = new SiteService(siteRepository);
