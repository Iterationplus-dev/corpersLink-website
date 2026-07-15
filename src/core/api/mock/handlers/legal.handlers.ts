import { ApiEndpoints } from '@/core/constants/api-endpoints';

import { mockRouter } from '../mock-router';
import { mockSuccess } from '../mock-response';
import { privacyContentSeed, termsContentSeed } from '../seed/legal.seed';

mockRouter.register('get', ApiEndpoints.privacy.content, () => mockSuccess(privacyContentSeed));
mockRouter.register('get', ApiEndpoints.terms.content, () => mockSuccess(termsContentSeed));
