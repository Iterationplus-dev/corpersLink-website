import type { ApiClient } from '@/core/api/client';
import { ApiEndpoints } from '@/core/constants/api-endpoints';
import { mapLegalContent } from '@/features/legal/mappers/legal.mapper';
import type { LegalContent, LegalContentDTO } from '@/features/legal/types';

import type { ILegalRepository } from './legal.repository';

export class LegalRepository implements ILegalRepository {
  constructor(private readonly client: ApiClient) {}

  async getPrivacyContent(): Promise<LegalContent> {
    const dto = await this.client.get<LegalContentDTO>(ApiEndpoints.privacy.content);
    return mapLegalContent(dto);
  }

  async getTermsContent(): Promise<LegalContent> {
    const dto = await this.client.get<LegalContentDTO>(ApiEndpoints.terms.content);
    return mapLegalContent(dto);
  }
}
