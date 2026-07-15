/**
 * Domain models consumed by the UI layer (composables, components). These
 * are the only shapes that should ever appear in a `.vue` file's props.
 */

export interface HeroStat {
  id: string;
  label: string;
  /** Pre-formatted for direct rendering, e.g. "12,480" or "4.8 ★". */
  displayValue: string;
}

export interface HowItWorksStep {
  stepNumber: number;
  title: string;
  description: string;
  iconPath: string;
}

export interface LandingHeroContent {
  badgeText: string;
  headline: string;
  subheadline: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  heroImageUrl: string;
  heroImageAlt: string;
}

export interface NewsletterSubscription {
  email: string;
  subscribed: boolean;
  subscribedAt: Date;
}
