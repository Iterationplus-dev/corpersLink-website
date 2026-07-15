import type {
  LegalContent,
  LegalContentDTO,
  LegalSection,
  LegalSectionDTO,
} from '@/features/legal/types';

export function mapLegalSection(dto: LegalSectionDTO): LegalSection {
  return { heading: dto.heading, body: dto.body };
}

export function mapLegalContent(dto: LegalContentDTO): LegalContent {
  return {
    headline: dto.headline,
    subheadline: dto.subheadline,
    sections: dto.sections.map(mapLegalSection),
  };
}
