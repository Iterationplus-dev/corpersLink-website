import { describe, expect, it } from 'vitest';

import type {
  HeroStatDTO,
  HowItWorksStepDTO,
  LandingHeroContentDTO,
  NewsletterSignupResponseDTO,
} from '@/features/landing/types';

import {
  mapHeroStat,
  mapHowItWorksStep,
  mapLandingHeroContent,
  mapNewsletterSubscription,
} from './landing.mapper';

describe('mapHeroStat', () => {
  it('formats a plain number stat with thousands separators', () => {
    const dto: HeroStatDTO = {
      id: 'seats-booked',
      label: 'Seats booked',
      value: 12480,
      value_suffix: null,
      display_format: 'number',
    };

    expect(mapHeroStat(dto).displayValue).toBe('12,480');
  });

  it('formats a decimal stat to one fixed digit', () => {
    const dto: HeroStatDTO = {
      id: 'growth',
      label: 'Growth',
      value: 12.489,
      value_suffix: '%',
      display_format: 'decimal',
    };

    expect(mapHeroStat(dto).displayValue).toBe('12.5%');
  });

  it('formats a rating stat with a trailing star', () => {
    const dto: HeroStatDTO = {
      id: 'average-rating',
      label: 'Average rider rating',
      value: 4.8,
      value_suffix: null,
      display_format: 'rating',
    };

    expect(mapHeroStat(dto).displayValue).toBe('4.8 ★');
  });

  it('preserves id and label unchanged', () => {
    const dto: HeroStatDTO = {
      id: 'institutions',
      label: 'Participating institutions',
      value: 64,
      value_suffix: null,
      display_format: 'number',
    };

    const model = mapHeroStat(dto);
    expect(model.id).toBe('institutions');
    expect(model.label).toBe('Participating institutions');
  });
});

describe('mapHowItWorksStep', () => {
  it('converts snake_case DTO fields to camelCase domain fields', () => {
    const dto: HowItWorksStepDTO = {
      step_number: 2,
      title: 'Pick your exact seat',
      description: 'Choose from the live seat map.',
      icon_path: 'seat-map',
    };

    expect(mapHowItWorksStep(dto)).toEqual({
      stepNumber: 2,
      title: 'Pick your exact seat',
      description: 'Choose from the live seat map.',
      iconPath: 'seat-map',
    });
  });
});

describe('mapLandingHeroContent', () => {
  it('converts snake_case hero DTO fields to camelCase domain fields', () => {
    const dto: LandingHeroContentDTO = {
      eyebrow_badge: '2026 BATCH B BOOKING NOW OPEN',
      headline: 'Book your seat to camp in minutes.',
      subheadline: 'Reserve a verified seat.',
      primary_cta_label: "Get started — it's free",
      secondary_cta_label: 'See how it works',
      hero_image_url: '/images/bus.png',
      hero_image_alt: 'Campus bus',
    };

    const model = mapLandingHeroContent(dto);

    expect(model.badgeText).toBe('2026 BATCH B BOOKING NOW OPEN');
    expect(model.primaryCtaLabel).toBe("Get started — it's free");
    expect(model.heroImageUrl).toBe('/images/bus.png');
    expect(model.heroImageAlt).toBe('Campus bus');
  });
});

describe('mapNewsletterSubscription', () => {
  it('parses the ISO timestamp into a Date instance', () => {
    const dto: NewsletterSignupResponseDTO = {
      email: 'student@example.com',
      subscribed: true,
      subscribed_at: '2026-07-15T10:00:00.000Z',
    };

    const model = mapNewsletterSubscription(dto);

    expect(model.email).toBe('student@example.com');
    expect(model.subscribed).toBe(true);
    expect(model.subscribedAt).toBeInstanceOf(Date);
    expect(model.subscribedAt.toISOString()).toBe('2026-07-15T10:00:00.000Z');
  });
});
