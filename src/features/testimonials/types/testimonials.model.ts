export interface Testimonial {
  stars: number;
  quote: string;
  initials: string;
  avatarColor: string;
  name: string;
  meta: string;
}

export interface TestimonialsContent {
  eyebrow: string;
  headline: string;
  ratingSummary: string;
  testimonials: Testimonial[];
}
