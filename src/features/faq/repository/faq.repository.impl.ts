import type { ApiClient } from '@/core/api/client';
import { ApiEndpoints } from '@/core/constants/api-endpoints';
import { mapFaqContent } from '@/features/faq/mappers/faq.mapper';
import type { FaqContent, FaqContentDTO } from '@/features/faq/types';

import type { IFaqRepository } from './faq.repository';

export class FaqRepository implements IFaqRepository {
  constructor(private readonly client: ApiClient) {}

  async getContent(): Promise<FaqContent> {
    const dto = await this.client.get<FaqContentDTO>(ApiEndpoints.faq.content);
    return mapFaqContent(dto);
  }
}
