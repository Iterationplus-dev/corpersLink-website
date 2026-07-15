import { ApiEndpoints } from '@/core/constants/api-endpoints';
import type { ApiClient } from '@/core/api/client';
import type {
  HeroStat,
  HeroStatDTO,
  HowItWorksStep,
  HowItWorksStepDTO,
  LandingHeroContent,
  LandingHeroContentDTO,
  NewsletterSignupResponseDTO,
  NewsletterSubscription,
} from '@/features/landing/types';
import {
  mapHeroStat,
  mapHowItWorksStep,
  mapLandingHeroContent,
  mapNewsletterSubscription,
} from '@/features/landing/mappers/landing.mapper';

import type { ILandingRepository } from './landing.repository';

/**
 * Concrete repository implementation. Talks to `ApiClient` only — it has no
 * idea whether requests are served by axios or the in-memory mock adapter.
 */
export class LandingRepository implements ILandingRepository {
  constructor(private readonly client: ApiClient) {}

  async getHeroStats(): Promise<HeroStat[]> {
    const dtos = await this.client.get<HeroStatDTO[]>(ApiEndpoints.landing.stats);
    return dtos.map(mapHeroStat);
  }

  async getHowItWorksSteps(): Promise<HowItWorksStep[]> {
    const dtos = await this.client.get<HowItWorksStepDTO[]>(ApiEndpoints.landing.howItWorks);
    return dtos.map(mapHowItWorksStep).sort((a, b) => a.stepNumber - b.stepNumber);
  }

  async getContent(): Promise<LandingHeroContent> {
    const dto = await this.client.get<LandingHeroContentDTO>(ApiEndpoints.landing.content);
    return mapLandingHeroContent(dto);
  }

  async subscribeToNewsletter(email: string): Promise<NewsletterSubscription> {
    const dto = await this.client.post<NewsletterSignupResponseDTO>(
      ApiEndpoints.landing.newsletter,
      { email },
    );
    return mapNewsletterSubscription(dto);
  }
}
