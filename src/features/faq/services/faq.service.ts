import { buildFaqContent } from '@/features/faq/mappers/faq.mapper';
import type { IFaqRepository } from '@/features/faq/repository';
import type { FaqContent } from '@/features/faq/types';

export class FaqService {
  constructor(private readonly repository: IFaqRepository) {}

  async loadFaqPage(): Promise<FaqContent> {
    const items = await this.repository.getItems();
    return buildFaqContent(items);
  }
}
