import type { ISupportRepository } from '@/features/support/repository';
import type { SupportContent } from '@/features/support/types';

export class SupportService {
  constructor(private readonly repository: ISupportRepository) {}

  async loadSupportPage(): Promise<SupportContent> {
    return this.repository.getContent();
  }
}
