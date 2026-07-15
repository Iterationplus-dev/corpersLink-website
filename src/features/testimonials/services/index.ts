import { testimonialsRepository } from '@/features/testimonials/repository';

import { TestimonialsService } from './testimonials.service';

export { TestimonialsService } from './testimonials.service';

export const testimonialsService = new TestimonialsService(testimonialsRepository);
