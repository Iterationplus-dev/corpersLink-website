import type { FaqContentDTO } from '@/features/faq/types';

export const faqContentSeed: FaqContentDTO = {
  headline: 'Frequently asked questions',
  subheadline: 'Booking, payment and departure — answered',
  items: [
    {
      question: 'How do I change my selected seat?',
      answer:
        "Before payment, tap your held seat again to release it and pick another — your 15-minute hold restarts on the new seat. After payment, seat changes are handled by your institution's transport desk, up until the departure manifest closes at 6:00 PM the day before travel.",
    },
    {
      question: 'My payment was debited but no receipt — what now?',
      answer:
        "Payments are verified automatically within 15 minutes. If your receipt hasn't arrived by then, contact support with your payment reference — never pay twice.",
    },
    {
      question: 'When does the departure manifest close?',
      answer:
        'The manifest closes at 6:00 PM on the day before departure. After that, seats and passenger details can no longer be changed.',
    },
    {
      question: 'Can I book for a friend?',
      answer:
        'No. Each corps member books with their own verified account — one active seat per person, matched to the departure manifest.',
    },
    {
      question: 'What happens if my seat hold expires?',
      answer:
        "Your held seat is released back to the pool and you're not charged. You can start a new booking any time seats remain.",
    },
  ],
};
