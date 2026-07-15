import type {
  AboutContent,
  AboutContentDTO,
  AboutStat,
  AboutStatDTO,
  AboutValue,
  AboutValueDTO,
} from '@/features/about/types';

export function mapAboutValue(dto: AboutValueDTO): AboutValue {
  return { iconKey: dto.icon_key, title: dto.title, description: dto.description };
}

export function mapAboutStat(dto: AboutStatDTO): AboutStat {
  return { id: dto.id, label: dto.label, value: dto.value };
}

export function mapAboutContent(dto: AboutContentDTO): AboutContent {
  return {
    eyebrow: dto.eyebrow,
    headline: dto.headline,
    body: dto.body,
    values: dto.values.map(mapAboutValue),
    stats: dto.stats.map(mapAboutStat),
  };
}
