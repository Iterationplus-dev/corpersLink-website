import type { ISiteRepository } from '@/features/site/repository';
import type { SiteChrome } from '@/features/site/types';

export class SiteService {
  constructor(private readonly repository: ISiteRepository) {}

  async loadChrome(): Promise<SiteChrome> {
    return this.repository.getChrome();
  }
}
