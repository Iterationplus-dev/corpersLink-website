import type { FaqContent, FaqItem, FaqItemDTO } from '@/features/faq/types';

export function mapFaqItem(dto: FaqItemDTO): FaqItem {
  return { id: dto.id, question: dto.question, answer: dto.answer, category: dto.category };
}

/** The real backend has no page-copy endpoint for FAQ — only the items list
 * (`GET support/faqs/`). Headline/subheadline are static frontend chrome. */
export function buildFaqContent(items: FaqItem[]): FaqContent {
  return {
    headline: 'Frequently asked questions',
    subheadline: 'Booking, payment and departure — answered',
    items,
  };
}
