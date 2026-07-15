import type { ILandingRepository } from '@/features/landing/repository';
import type {
  HeroStat,
  HowItWorksStep,
  LandingHeroContent,
  NewsletterSubscription,
} from '@/features/landing/types';

export interface LandingPageData {
  hero: LandingHeroContent;
  stats: HeroStat[];
  steps: HowItWorksStep[];
}

/**
 * Orchestrates repository calls into the shapes the UI actually needs.
 * This is where cross-cutting business rules live (e.g. combining three
 * independent endpoints into a single page payload) — never in components
 * and never in the repository itself.
 */
export class LandingService {
  constructor(private readonly repository: ILandingRepository) {}

  async loadLandingPage(): Promise<LandingPageData> {
    const [hero, stats, steps] = await Promise.all([
      this.repository.getContent(),
      this.repository.getHeroStats(),
      this.repository.getHowItWorksSteps(),
    ]);

    return { hero, stats, steps };
  }

  async subscribeToNewsletter(email: string): Promise<NewsletterSubscription> {
    const normalizedEmail = email.trim().toLowerCase();
    return this.repository.subscribeToNewsletter(normalizedEmail);
  }
}
