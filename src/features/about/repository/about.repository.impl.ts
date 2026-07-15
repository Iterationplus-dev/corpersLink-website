import type { ApiClient } from '@/core/api/client';
import { ApiEndpoints } from '@/core/constants/api-endpoints';
import { mapAboutContent } from '@/features/about/mappers/about.mapper';
import type { AboutContent, AboutContentDTO } from '@/features/about/types';

import type { IAboutRepository } from './about.repository';

export class AboutRepository implements IAboutRepository {
  constructor(private readonly client: ApiClient) {}

  async getContent(): Promise<AboutContent> {
    const dto = await this.client.get<AboutContentDTO>(ApiEndpoints.about.content);
    return mapAboutContent(dto);
  }
}
