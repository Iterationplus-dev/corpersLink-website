import { legalRepository } from '@/features/legal/repository';

import { LegalService } from './legal.service';

export { LegalService } from './legal.service';

export const legalService = new LegalService(legalRepository);
