import { landingRepository } from '@/features/landing/repository';

import { LandingService } from './landing.service';

export type { LandingPageData } from './landing.service';
export { LandingService } from './landing.service';

export const landingService = new LandingService(landingRepository);
