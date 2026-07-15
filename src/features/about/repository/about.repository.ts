import type { AboutContent } from '@/features/about/types';

export interface IAboutRepository {
  getContent(): Promise<AboutContent>;
}
