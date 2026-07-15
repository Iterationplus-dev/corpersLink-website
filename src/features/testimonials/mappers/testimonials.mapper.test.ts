import { describe, expect, it } from 'vitest';

import type { TestimonialsContentDTO } from '@/features/testimonials/types';

import { mapTestimonial, mapTestimonialsContent } from './testimonials.mapper';

describe('mapTestimonial', () => {
  it('maps avatar_color to camelCase avatarColor', () => {
    const model = mapTestimonial({
      stars: 5,
      quote: 'Great experience.',
      initials: 'AO',
      avatar_color: '#1F3A5F',
      name: 'Adaeze O.',
      meta: 'UNILAG',
    });

    expect(model.avatarColor).toBe('#1F3A5F');
    expect(model.stars).toBe(5);
  });
});

describe('mapTestimonialsContent', () => {
  it('maps rating_summary and the nested testimonials array', () => {
    const dto: TestimonialsContentDTO = {
      eyebrow: 'Testimonials',
      headline: 'headline',
      rating_summary: '4.8 average from 3,214 riders',
      testimonials: [
        {
          stars: 5,
          quote: 'Q',
          initials: 'AB',
          avatar_color: '#000',
          name: 'A B',
          meta: 'meta',
        },
      ],
    };

    const model = mapTestimonialsContent(dto);

    expect(model.ratingSummary).toBe('4.8 average from 3,214 riders');
    expect(model.testimonials).toHaveLength(1);
    expect(model.testimonials[0]?.avatarColor).toBe('#000');
  });
});
