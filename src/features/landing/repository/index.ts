import { apiClient } from '@/core/api/client';

import { LandingRepository } from './landing.repository.impl';

export type { ILandingRepository } from './landing.repository';
export { LandingRepository } from './landing.repository.impl';

/**
 * Composition root for this feature's repository. Exported as a singleton
 * bound to the app-wide `apiClient`, with the class itself still exported so
 * tests can `new LandingRepository(fakeClient)` directly.
 */
export const landingRepository = new LandingRepository(apiClient);
