import type { FaqContent, FaqContentDTO, FaqItem, FaqItemDTO } from '@/features/faq/types';

export function mapFaqItem(dto: FaqItemDTO): FaqItem {
  return { question: dto.question, answer: dto.answer };
}

export function mapFaqContent(dto: FaqContentDTO): FaqContent {
  return {
    headline: dto.headline,
    subheadline: dto.subheadline,
    items: dto.items.map(mapFaqItem),
  };
}
