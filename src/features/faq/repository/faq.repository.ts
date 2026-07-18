import type { FaqItem } from '@/features/faq/types';

export interface IFaqRepository {
  getItems(): Promise<FaqItem[]>;
}
