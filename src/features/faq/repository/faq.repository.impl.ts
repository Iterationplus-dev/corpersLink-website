import type { ApiClient } from '@/core/api/client';
import { ApiEndpoints } from '@/core/constants/api-endpoints';
import { mapFaqItem } from '@/features/faq/mappers/faq.mapper';
import type { FaqItem, FaqItemDTO } from '@/features/faq/types';

import type { IFaqRepository } from './faq.repository';

export class FaqRepository implements IFaqRepository {
  constructor(private readonly client: ApiClient) {}

  async getItems(): Promise<FaqItem[]> {
    const dtos = await this.client.get<FaqItemDTO[]>(ApiEndpoints.faq.list);
    return dtos.map(mapFaqItem);
  }
}
