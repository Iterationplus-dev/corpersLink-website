import type { IInstitutionsRepository } from '@/features/institutions/repository';
import type { Institution } from '@/features/institutions/types';

export class InstitutionsService {
  constructor(private readonly repository: IInstitutionsRepository) {}

  async search(query: string): Promise<Institution[]> {
    return this.repository.search(query.trim());
  }

  async getById(id: number): Promise<Institution> {
    return this.repository.getById(id);
  }
}
