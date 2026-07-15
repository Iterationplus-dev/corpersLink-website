import { ApiEndpoints } from '@/core/constants/api-endpoints';

import { mockRouter } from '../mock-router';
import { mockSuccess } from '../mock-response';
import { siteChromeSeed } from '../seed/site.seed';

mockRouter.register('get', ApiEndpoints.site.chrome, () => mockSuccess(siteChromeSeed));
