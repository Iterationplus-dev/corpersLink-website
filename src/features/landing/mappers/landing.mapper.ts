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

function formatStatValue(dto: HeroStatDTO): string {
  const formatted =
    dto.display_format === 'decimal'
      ? dto.value.toFixed(1)
      : new Intl.NumberFormat('en-US').format(dto.value);

  const suffix = dto.value_suffix ?? '';
  return dto.display_format === 'rating' ? `${formatted} ★` : `${formatted}${suffix}`;
}

export function mapHeroStat(dto: HeroStatDTO): HeroStat {
  return {
    id: dto.id,
    label: dto.label,
    displayValue: formatStatValue(dto),
  };
}

export function mapHowItWorksStep(dto: HowItWorksStepDTO): HowItWorksStep {
  return {
    stepNumber: dto.step_number,
    title: dto.title,
    description: dto.description,
    iconPath: dto.icon_path,
  };
}

export function mapLandingHeroContent(dto: LandingHeroContentDTO): LandingHeroContent {
  return {
    badgeText: dto.eyebrow_badge,
    headline: dto.headline,
    subheadline: dto.subheadline,
    primaryCtaLabel: dto.primary_cta_label,
    secondaryCtaLabel: dto.secondary_cta_label,
    heroImageUrl: dto.hero_image_url,
    heroImageAlt: dto.hero_image_alt,
  };
}

export function mapNewsletterSubscription(
  dto: NewsletterSignupResponseDTO,
): NewsletterSubscription {
  return {
    email: dto.email,
    subscribed: dto.subscribed,
    subscribedAt: new Date(dto.subscribed_at),
  };
}
