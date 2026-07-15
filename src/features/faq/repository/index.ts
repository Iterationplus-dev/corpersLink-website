import { apiClient } from '@/core/api/client';

import { FaqRepository } from './faq.repository.impl';

export type { IFaqRepository } from './faq.repository';
export { FaqRepository } from './faq.repository.impl';

export const faqRepository = new FaqRepository(apiClient);
