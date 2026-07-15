import { describe, expect, it, vi } from 'vitest';

import type { ILandingRepository } from '@/features/landing/repository';
import type {
  HeroStat,
  HowItWorksStep,
  LandingHeroContent,
  NewsletterSubscription,
} from '@/features/landing/types';

import { LandingService } from './landing.service';

function createFakeRepository(overrides: Partial<ILandingRepository> = {}): ILandingRepository {
  return {
    getHeroStats: vi.fn().mockResolvedValue([]),
    getHowItWorksSteps: vi.fn().mockResolvedValue([]),
    getContent: vi.fn().mockResolvedValue({} as LandingHeroContent),
    subscribeToNewsletter: vi.fn().mockResolvedValue({} as NewsletterSubscription),
    ...overrides,
  };
}

describe('LandingService.loadLandingPage', () => {
  it('combines hero content, stats and steps from independent repository calls', async () => {
    const hero = { headline: 'x' } as unknown as LandingHeroContent;
    const stats = [{ id: 'a' }] as unknown as HeroStat[];
    const steps = [{ stepNumber: 1 }] as unknown as HowItWorksStep[];

    const repository = createFakeRepository({
      getContent: vi.fn().mockResolvedValue(hero),
      getHeroStats: vi.fn().mockResolvedValue(stats),
      getHowItWorksSteps: vi.fn().mockResolvedValue(steps),
    });
    const service = new LandingService(repository);

    const page = await service.loadLandingPage();

    expect(page).toEqual({ hero, stats, steps });
  });

  it('rejects if any of the three parallel calls fails', async () => {
    const repository = createFakeRepository({
      getHeroStats: vi.fn().mockRejectedValue(new Error('stats down')),
    });
    const service = new LandingService(repository);

    await expect(service.loadLandingPage()).rejects.toThrow('stats down');
  });
});

describe('LandingService.subscribeToNewsletter', () => {
  it('normalizes the email (trim + lowercase) before delegating to the repository', async () => {
    const subscribeToNewsletter = vi.fn().mockResolvedValue({
      email: 'student@example.com',
      subscribed: true,
      subscribedAt: new Date(),
    });
    const service = new LandingService(createFakeRepository({ subscribeToNewsletter }));

    await service.subscribeToNewsletter('  Student@Example.com  ');

    expect(subscribeToNewsletter).toHaveBeenCalledWith('student@example.com');
  });
});
