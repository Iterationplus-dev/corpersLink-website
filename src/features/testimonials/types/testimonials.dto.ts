export interface TestimonialDTO {
  stars: number;
  quote: string;
  initials: string;
  avatar_color: string;
  name: string;
  meta: string;
}

export interface TestimonialsContentDTO {
  eyebrow: string;
  headline: string;
  rating_summary: string;
  testimonials: TestimonialDTO[];
}
