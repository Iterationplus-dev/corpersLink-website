import type { LegalContent } from '@/features/legal/types';

export interface ILegalRepository {
  getPrivacyContent(): Promise<LegalContent>;
  getTermsContent(): Promise<LegalContent>;
}
