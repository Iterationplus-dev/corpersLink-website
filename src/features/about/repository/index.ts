import { apiClient } from '@/core/api/client';

import { AboutRepository } from './about.repository.impl';

export type { IAboutRepository } from './about.repository';
export { AboutRepository } from './about.repository.impl';

export const aboutRepository = new AboutRepository(apiClient);
