import { apiClient } from '@/core/api/client';

import { SupportRepository } from './support.repository.impl';

export type { ISupportRepository } from './support.repository';
export { SupportRepository } from './support.repository.impl';

export const supportRepository = new SupportRepository(apiClient);
