import { apiClient } from '@/core/api/client';

import { TestimonialsRepository } from './testimonials.repository.impl';

export type { ITestimonialsRepository } from './testimonials.repository';
export { TestimonialsRepository } from './testimonials.repository.impl';

export const testimonialsRepository = new TestimonialsRepository(apiClient);
