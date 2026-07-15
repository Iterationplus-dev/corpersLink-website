import type {
  HeroStat,
  HowItWorksStep,
  LandingHeroContent,
  NewsletterSubscription,
} from '@/features/landing/types';

/**
 * Repository contract for the landing feature. The service layer depends on
 * this interface only, which is what lets tests substitute an in-memory
 * fake without touching HTTP at all.
 */
export interface ILandingRepository {
  getHeroStats(): Promise<HeroStat[]>;
  getHowItWorksSteps(): Promise<HowItWorksStep[]>;
  getContent(): Promise<LandingHeroContent>;
  subscribeToNewsletter(email: string): Promise<NewsletterSubscription>;
}
