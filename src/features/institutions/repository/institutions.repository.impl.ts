import type { ApiClient } from '@/core/api/client';
import { ApiEndpoints } from '@/core/constants/api-endpoints';
import { mapInstitution } from '@/features/institutions/mappers/institutions.mapper';
import type { Institution, InstitutionDTO } from '@/features/institutions/types';

import type { IInstitutionsRepository } from './institutions.repository';

export class InstitutionsRepository implements IInstitutionsRepository {
  constructor(private readonly client: ApiClient) {}

  async search(query: string): Promise<Institution[]> {
    const dtos = await this.client.get<InstitutionDTO[]>(ApiEndpoints.institutions.list, {
      params: query ? { search: query } : undefined,
    });
    return dtos.map(mapInstitution);
  }

  async getById(id: number): Promise<Institution> {
    const dto = await this.client.get<InstitutionDTO>(ApiEndpoints.institutions.show(id));
    return mapInstitution(dto);
  }
}
