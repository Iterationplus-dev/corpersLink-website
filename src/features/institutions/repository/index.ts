import { apiClient } from '@/core/api/client';

import { InstitutionsRepository } from './institutions.repository.impl';

export type { IInstitutionsRepository } from './institutions.repository';
export { InstitutionsRepository } from './institutions.repository.impl';

export const institutionsRepository = new InstitutionsRepository(apiClient);
