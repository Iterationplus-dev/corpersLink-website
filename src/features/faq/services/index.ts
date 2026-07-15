import { faqRepository } from '@/features/faq/repository';

import { FaqService } from './faq.service';

export { FaqService } from './faq.service';

export const faqService = new FaqService(faqRepository);
