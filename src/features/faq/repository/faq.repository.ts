import type { FaqContent } from '@/features/faq/types';

export interface IFaqRepository {
  getContent(): Promise<FaqContent>;
}
