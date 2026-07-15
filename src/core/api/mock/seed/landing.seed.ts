import heroImageUrl from '@/assets/illustrations/hero-corps-member.png';
import type {
  HeroStatDTO,
  HowItWorksStepDTO,
  LandingHeroContentDTO,
} from '@/features/landing/types';

/**
 * Seed data mirrors the approved CorpersLink design spec (see
 * "CorpsLink Screens v2" — Landing page / M1) so the mock backend renders
 * pixel-identical copy and numbers to what the real API is expected to serve.
 */

export const heroStatsSeed: HeroStatDTO[] = [
  {
    id: 'seats-booked',
    label: 'Seats booked this season',
    value: 12480,
    value_suffix: null,
    display_format: 'number',
  },
  {
    id: 'participating-institutions',
    label: 'Participating institutions',
    value: 64,
    value_suffix: null,
    display_format: 'number',
  },
  {
    id: 'average-rating',
    label: 'Average rider rating',
    value: 4.8,
    value_suffix: null,
    display_format: 'rating',
  },
];

export const howItWorksSeed: HowItWorksStepDTO[] = [
  {
    step_number: 1,
    title: 'Find your institution',
    description:
      'Search the verified list of participating schools and see every vehicle scheduled for your camp.',
    icon_path: 'search-institution',
  },
  {
    step_number: 2,
    title: 'Pick your exact seat',
    description:
      "Choose from the live seat map — available, held and occupied — and lock yours before it's gone.",
    icon_path: 'seat-map',
  },
  {
    step_number: 3,
    title: 'Pay & ride with proof',
    description:
      'Pay the published fare securely. Your e-receipt and manifest entry are generated instantly.',
    icon_path: 'secure-payment',
  },
];

export const landingHeroContentSeed: LandingHeroContentDTO = {
  eyebrow_badge: '2026 BATCH B BOOKING NOW OPEN',
  headline: 'Book your seat to camp in minutes.',
  subheadline:
    "Reserve a verified seat on your institution's NYSC camp transport, pay securely, and get your receipt instantly.",
  primary_cta_label: "Get started — it's free",
  secondary_cta_label: 'See how it works',
  hero_image_url: heroImageUrl,
  hero_image_alt:
    'A corps member checks her trip details on her phone beside a CorpersLink bus at the Student Union departure point.',
};
