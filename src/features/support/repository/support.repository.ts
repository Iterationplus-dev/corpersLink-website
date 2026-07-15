import type { SupportContent } from '@/features/support/types';

export interface ISupportRepository {
  getContent(): Promise<SupportContent>;
}
