import { ApiEndpoints } from '@/core/constants/api-endpoints';

import { mockRouter } from '../mock-router';
import { mockSuccess } from '../mock-response';
import { faqContentSeed } from '../seed/faq.seed';

mockRouter.register('get', ApiEndpoints.faq.content, () => mockSuccess(faqContentSeed));
