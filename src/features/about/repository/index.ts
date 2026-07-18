import { MockApiClient } from '@/core/api/client';

import { AboutRepository } from './about.repository.impl';

export type { IAboutRepository } from './about.repository';
export { AboutRepository } from './about.repository.impl';

/**
 * Always mock, regardless of `VITE_USE_MOCK_API` — the real backend is
 * transactional-only and has no content endpoint for this marketing page.
 */
export const aboutRepository = new AboutRepository(new MockApiClient());
