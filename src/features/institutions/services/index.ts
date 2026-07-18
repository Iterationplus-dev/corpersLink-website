import { institutionsRepository } from '@/features/institutions/repository';

import { InstitutionsService } from './institutions.service';

export { InstitutionsService } from './institutions.service';

export const institutionsService = new InstitutionsService(institutionsRepository);
