import { MockApiClient } from '@/core/api/client';

import { LegalRepository } from './legal.repository.impl';

export type { ILegalRepository } from './legal.repository';
export { LegalRepository } from './legal.repository.impl';

/**
 * Always mock, regardless of `VITE_USE_MOCK_API` — the real backend has no
 * content endpoint for privacy/terms copy.
 */
export const legalRepository = new LegalRepository(new MockApiClient());
