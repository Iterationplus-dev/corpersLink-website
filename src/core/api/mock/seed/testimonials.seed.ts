import type { TestimonialsContentDTO } from '@/features/testimonials/types';

export const testimonialsContentSeed: TestimonialsContentDTO = {
  eyebrow: 'Testimonials',
  headline: 'Corps members who arrived stress-free',
  rating_summary: '4.8 average from 3,214 verified riders · 2026 Batch A & B',
  testimonials: [
    {
      stars: 5,
      quote:
        'I booked Seat 3 from my hostel the night before and just walked onto the bus at the gate. No shouting, no cash arguments.',
      initials: 'AO',
      avatar_color: '#1F3A5F',
      name: 'Adaeze O.',
      meta: 'UNILAG — Iyana-Ipaja Camp',
    },
    {
      stars: 5,
      quote:
        'The receipt with the QR code saved me — my name was on the manifest before I even got to the park.',
      initials: 'CE',
      avatar_color: '#16815A',
      name: 'Chidi E.',
      meta: 'UNIPORT — Nonwa-Tai Camp',
    },
    {
      stars: 5,
      quote:
        'Last year my brother paid double at the park. I paid the published fare on CorpersLink and got a window seat.',
      initials: 'FB',
      avatar_color: '#B7791F',
      name: 'Fatima B.',
      meta: 'ABU — Kubwa Camp',
    },
    {
      stars: 5,
      quote:
        'My payment failed the first time but the app told me exactly why, held my seat, and the retry worked in seconds.',
      initials: 'TA',
      avatar_color: '#1F3A5F',
      name: 'Tunde A.',
      meta: 'OAU — Ede Camp',
    },
    {
      stars: 5,
      quote:
        'The bus was verified and my mum could follow my trip details and live updates. She finally relaxed.',
      initials: 'NM',
      avatar_color: '#16815A',
      name: 'Ngozi M.',
      meta: 'UNN — Awgu Camp',
    },
    {
      stars: 5,
      quote:
        'Even offline at the park, my saved receipt and seat number were right there on the app. Check-in took a minute.',
      initials: 'IS',
      avatar_color: '#B7791F',
      name: 'Ibrahim S.',
      meta: 'BUK — Kusalla Camp',
    },
  ],
};
