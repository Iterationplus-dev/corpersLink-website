import { supportRepository } from '@/features/support/repository';

import { SupportService } from './support.service';

export { SupportService } from './support.service';

export const supportService = new SupportService(supportRepository);
