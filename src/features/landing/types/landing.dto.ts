/**
 * Wire-format types — exactly what the HTTP layer (real or mocked) returns.
 * Components must never consume these directly; always go through the
 * mapper into a domain model (see `landing.model.ts`).
 */

export interface HeroStatDTO {
  id: string;
  label: string;
  value: number;
  value_suffix: string | null;
  display_format: 'number' | 'decimal' | 'rating';
}

export interface HowItWorksStepDTO {
  step_number: number;
  title: string;
  description: string;
  icon_path: string;
}

export interface LandingHeroContentDTO {
  eyebrow_badge: string;
  headline: string;
  subheadline: string;
  primary_cta_label: string;
  secondary_cta_label: string;
  hero_image_url: string;
  hero_image_alt: string;
}

export interface NewsletterSignupRequestDTO {
  email: string;
}

export interface NewsletterSignupResponseDTO {
  email: string;
  subscribed: boolean;
  subscribed_at: string;
}
