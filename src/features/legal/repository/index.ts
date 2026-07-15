import { apiClient } from '@/core/api/client';

import { LegalRepository } from './legal.repository.impl';

export type { ILegalRepository } from './legal.repository';
export { LegalRepository } from './legal.repository.impl';

export const legalRepository = new LegalRepository(apiClient);
