export type AboutValueIconKey = 'verified' | 'fair-fares' | 'community';

export interface AboutValueDTO {
  icon_key: AboutValueIconKey;
  title: string;
  description: string;
}

export interface AboutStatDTO {
  id: string;
  label: string;
  value: string;
}

export interface AboutContentDTO {
  eyebrow: string;
  headline: string;
  body: string;
  values: AboutValueDTO[];
  stats: AboutStatDTO[];
}
