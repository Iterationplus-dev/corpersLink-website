import { MockApiClient } from '@/core/api/client';

import { SupportRepository } from './support.repository.impl';

export type { ISupportRepository } from './support.repository';
export { SupportRepository } from './support.repository.impl';

/**
 * Always mock, regardless of `VITE_USE_MOCK_API` — the live-chat card and
 * FAQ-preview list here are presentational/static with no backend
 * equivalent. NOTE: the institution contact card (`data.contact`) is a
 * placeholder for now — once the Auth/Account domains are rewired to the
 * real backend, `SupportView.vue` should read institution contact info
 * (`supportPhone`/`supportEmail`/`supportHours`) directly off the signed-in
 * user's real `institution` instead of from this mock content.
 */
export const supportRepository = new SupportRepository(new MockApiClient());
