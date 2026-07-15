import { ApiEndpoints } from '@/core/constants/api-endpoints';
import type { NewsletterSignupResponseDTO } from '@/features/landing/types';

import { heroStatsSeed, howItWorksSeed, landingHeroContentSeed } from '../seed/landing.seed';
import { mockRouter } from '../mock-router';
import { mockSuccess, mockValidationError, mockServerError } from '../mock-response';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

mockRouter.register('get', ApiEndpoints.landing.stats, () => mockSuccess(heroStatsSeed));

mockRouter.register('get', ApiEndpoints.landing.howItWorks, () => mockSuccess(howItWorksSeed));

mockRouter.register('get', ApiEndpoints.landing.content, () => mockSuccess(landingHeroContentSeed));

mockRouter.register('post', ApiEndpoints.landing.newsletter, ({ body }) => {
  const payload = body as { email?: unknown } | null;
  const email = typeof payload?.email === 'string' ? payload.email.trim() : '';

  if (!email) {
    return mockValidationError({ email: ['Email address is required.'] });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return mockValidationError({ email: ['Enter a valid email address.'] });
  }
  // Deterministic failure hook so tests / demos can exercise the 500 path
  // without touching production code paths.
  if (email.endsWith('@fails.test')) {
    return mockServerError();
  }

  const response: NewsletterSignupResponseDTO = {
    email,
    subscribed: true,
    subscribed_at: new Date().toISOString(),
  };
  return mockSuccess(response);
});
