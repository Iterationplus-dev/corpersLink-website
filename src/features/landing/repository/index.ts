import { MockApiClient } from '@/core/api/client';

import { LandingRepository } from './landing.repository.impl';

export type { ILandingRepository } from './landing.repository';
export { LandingRepository } from './landing.repository.impl';

/**
 * Composition root for this feature's repository. Always mock, regardless of
 * `VITE_USE_MOCK_API` — the real backend is transactional-only and has no
 * content endpoint for the landing page. The class itself is still exported
 * so tests can `new LandingRepository(fakeClient)` directly.
 */
export const landingRepository = new LandingRepository(new MockApiClient());
