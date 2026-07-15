import { ApiEndpoints } from '@/core/constants/api-endpoints';

import { mockRouter } from '../mock-router';
import { mockSuccess } from '../mock-response';
import { aboutContentSeed } from '../seed/about.seed';

mockRouter.register('get', ApiEndpoints.about.content, () => mockSuccess(aboutContentSeed));
