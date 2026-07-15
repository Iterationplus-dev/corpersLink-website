import { ApiEndpoints } from '@/core/constants/api-endpoints';

import { mockRouter } from '../mock-router';
import { mockSuccess } from '../mock-response';
import { supportContentSeed } from '../seed/support.seed';

mockRouter.register('get', ApiEndpoints.support.content, () => mockSuccess(supportContentSeed));
