import type { ApiClient } from '@/core/api/client';
import { ApiEndpoints } from '@/core/constants/api-endpoints';
import { mapSupportContent } from '@/features/support/mappers/support.mapper';
import type { SupportContent, SupportContentDTO } from '@/features/support/types';

import type { ISupportRepository } from './support.repository';

export class SupportRepository implements ISupportRepository {
  constructor(private readonly client: ApiClient) {}

  async getContent(): Promise<SupportContent> {
    const dto = await this.client.get<SupportContentDTO>(ApiEndpoints.support.content);
    return mapSupportContent(dto);
  }
}
