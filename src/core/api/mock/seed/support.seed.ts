import type { SupportContentDTO } from '@/features/support/types';

export const supportContentSeed: SupportContentDTO = {
  headline: 'How can we help?',
  subheadline: 'Common questions about booking, payment and departure',
  faq_preview: [
    'How do I change my selected seat?',
    'My payment was debited but no receipt — what now?',
    'When does the departure manifest close?',
    'Can I book for a friend?',
    'What happens if my seat hold expires?',
  ],
  contact: {
    institution_name: 'University of Lagos',
    hours: 'Mon–Fri, 9 AM–5 PM',
    phone: '0700-CORPERSLINK',
    email: 'transport@unilag.edu.ng',
  },
  refund_notice:
    'Refunds and manifest changes are handled by your institution — CorpersLink support cannot alter published fares.',
};
