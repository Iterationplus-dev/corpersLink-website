import type { AboutValueIconKey } from './about.dto';

export interface AboutValue {
  iconKey: AboutValueIconKey;
  title: string;
  description: string;
}

export interface AboutStat {
  id: string;
  label: string;
  value: string;
}

export interface AboutContent {
  eyebrow: string;
  headline: string;
  body: string;
  values: AboutValue[];
  stats: AboutStat[];
}
