import type { IAboutRepository } from '@/features/about/repository';
import type { AboutContent } from '@/features/about/types';

export class AboutService {
  constructor(private readonly repository: IAboutRepository) {}

  async loadAboutPage(): Promise<AboutContent> {
    return this.repository.getContent();
  }
}
