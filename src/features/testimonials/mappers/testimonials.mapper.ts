import type {
  Testimonial,
  TestimonialDTO,
  TestimonialsContent,
  TestimonialsContentDTO,
} from '@/features/testimonials/types';

export function mapTestimonial(dto: TestimonialDTO): Testimonial {
  return {
    stars: dto.stars,
    quote: dto.quote,
    initials: dto.initials,
    avatarColor: dto.avatar_color,
    name: dto.name,
    meta: dto.meta,
  };
}

export function mapTestimonialsContent(dto: TestimonialsContentDTO): TestimonialsContent {
  return {
    eyebrow: dto.eyebrow,
    headline: dto.headline,
    ratingSummary: dto.rating_summary,
    testimonials: dto.testimonials.map(mapTestimonial),
  };
}
