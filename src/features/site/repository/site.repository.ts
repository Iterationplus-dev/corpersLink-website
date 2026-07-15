import type { SiteChrome } from '@/features/site/types';

export interface ISiteRepository {
  getChrome(): Promise<SiteChrome>;
}
