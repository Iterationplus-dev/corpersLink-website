import { describe, expect, it, vi } from 'vitest';

import { ApiEndpoints } from '@/core/constants/api-endpoints';
import type { ApiClient } from '@/core/api/client';
import type {
  HeroStatDTO,
  HowItWorksStepDTO,
  LandingHeroContentDTO,
  NewsletterSignupResponseDTO,
} from '@/features/landing/types';

import { LandingRepository } from './landing.repository.impl';

function createFakeClient(overrides: Partial<ApiClient> = {}): ApiClient {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  };
}

describe('LandingRepository', () => {
  it('getHeroStats fetches the stats endpoint and maps every DTO', async () => {
    const dtos: HeroStatDTO[] = [
      { id: 'a', label: 'A', value: 10, value_suffix: null, display_format: 'number' },
      { id: 'b', label: 'B', value: 4.8, value_suffix: null, display_format: 'rating' },
    ];
    const get = vi.fn().mockResolvedValue(dtos);
    const repository = new LandingRepository(createFakeClient({ get }));

    const stats = await repository.getHeroStats();

    expect(get).toHaveBeenCalledWith(ApiEndpoints.landing.stats);
    expect(stats).toEqual([
      { id: 'a', label: 'A', displayValue: '10' },
      { id: 'b', label: 'B', displayValue: '4.8 ★' },
    ]);
  });

  it('getHowItWorksSteps sorts steps by stepNumber regardless of DTO order', async () => {
    const dtos: HowItWorksStepDTO[] = [
      { step_number: 2, title: 'Second', description: '', icon_path: '' },
      { step_number: 1, title: 'First', description: '', icon_path: '' },
    ];
    const get = vi.fn().mockResolvedValue(dtos);
    const repository = new LandingRepository(createFakeClient({ get }));

    const steps = await repository.getHowItWorksSteps();

    expect(steps.map((s) => s.title)).toEqual(['First', 'Second']);
  });

  it('getContent fetches the content endpoint and maps it', async () => {
    const dto: LandingHeroContentDTO = {
      eyebrow_badge: 'badge',
      headline: 'headline',
      subheadline: 'sub',
      primary_cta_label: 'primary',
      secondary_cta_label: 'secondary',
      hero_image_url: '/x.png',
      hero_image_alt: 'alt',
    };
    const get = vi.fn().mockResolvedValue(dto);
    const repository = new LandingRepository(createFakeClient({ get }));

    const content = await repository.getContent();

    expect(get).toHaveBeenCalledWith(ApiEndpoints.landing.content);
    expect(content.headline).toBe('headline');
  });

  it('subscribeToNewsletter posts the email and maps the response', async () => {
    const dto: NewsletterSignupResponseDTO = {
      email: 'test@example.com',
      subscribed: true,
      subscribed_at: '2026-01-01T00:00:00.000Z',
    };
    const post = vi.fn().mockResolvedValue(dto);
    const repository = new LandingRepository(createFakeClient({ post }));

    const subscription = await repository.subscribeToNewsletter('test@example.com');

    expect(post).toHaveBeenCalledWith(ApiEndpoints.landing.newsletter, {
      email: 'test@example.com',
    });
    expect(subscription.subscribed).toBe(true);
  });

  it('propagates repository errors untouched (no swallowing)', async () => {
    const get = vi.fn().mockRejectedValue(new Error('network down'));
    const repository = new LandingRepository(createFakeClient({ get }));

    await expect(repository.getHeroStats()).rejects.toThrow('network down');
  });
});
