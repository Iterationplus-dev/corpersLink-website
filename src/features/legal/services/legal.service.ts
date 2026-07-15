import type { ILegalRepository } from '@/features/legal/repository';
import type { LegalContent } from '@/features/legal/types';

export class LegalService {
  constructor(private readonly repository: ILegalRepository) {}

  async loadPrivacyPage(): Promise<LegalContent> {
    return this.repository.getPrivacyContent();
  }

  async loadTermsPage(): Promise<LegalContent> {
    return this.repository.getTermsContent();
  }
}
