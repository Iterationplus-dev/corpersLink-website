import type { Institution } from '@/features/institutions/types';

export interface IInstitutionsRepository {
  search(query: string): Promise<Institution[]>;
  getById(id: number): Promise<Institution>;
}
