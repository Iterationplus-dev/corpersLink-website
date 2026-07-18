import { MockApiClient } from '@/core/api/client';

import { TestimonialsRepository } from './testimonials.repository.impl';

export type { ITestimonialsRepository } from './testimonials.repository';
export { TestimonialsRepository } from './testimonials.repository.impl';

/**
 * Always mock, regardless of `VITE_USE_MOCK_API` — the real backend is
 * transactional-only and has no content endpoint for this marketing page.
 */
export const testimonialsRepository = new TestimonialsRepository(new MockApiClient());
