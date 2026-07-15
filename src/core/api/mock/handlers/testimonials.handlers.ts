import { ApiEndpoints } from '@/core/constants/api-endpoints';

import { mockRouter } from '../mock-router';
import { mockSuccess } from '../mock-response';
import { testimonialsContentSeed } from '../seed/testimonials.seed';

mockRouter.register('get', ApiEndpoints.testimonials.content, () =>
  mockSuccess(testimonialsContentSeed),
);
