import type { ApiClient } from '@/core/api/client';
import { ApiEndpoints } from '@/core/constants/api-endpoints';
import { mapSiteChrome } from '@/features/site/mappers/site.mapper';
import type { SiteChrome, SiteChromeDTO } from '@/features/site/types';

import type { ISiteRepository } from './site.repository';

export class SiteRepository implements ISiteRepository {
  constructor(private readonly client: ApiClient) {}

  async getChrome(): Promise<SiteChrome> {
    const dto = await this.client.get<SiteChromeDTO>(ApiEndpoints.site.chrome);
    return mapSiteChrome(dto);
  }
}
