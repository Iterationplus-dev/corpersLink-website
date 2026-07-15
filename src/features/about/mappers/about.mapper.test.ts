import { describe, expect, it } from 'vitest';

import type { AboutContentDTO } from '@/features/about/types';

import { mapAboutContent, mapAboutStat, mapAboutValue } from './about.mapper';

describe('mapAboutValue', () => {
  it('maps icon_key/title/description to camelCase', () => {
    const model = mapAboutValue({
      icon_key: 'verified',
      title: 'Verified, end to end',
      description: 'Every transporter is vetted.',
    });

    expect(model).toEqual({
      iconKey: 'verified',
      title: 'Verified, end to end',
      description: 'Every transporter is vetted.',
    });
  });
});

describe('mapAboutStat', () => {
  it('maps id/label/value unchanged', () => {
    expect(mapAboutStat({ id: 'founded', label: 'Founded in Lagos', value: '2024' })).toEqual({
      id: 'founded',
      label: 'Founded in Lagos',
      value: '2024',
    });
  });
});

describe('mapAboutContent', () => {
  it('maps nested values and stats arrays', () => {
    const dto: AboutContentDTO = {
      eyebrow: 'About CorpersLink',
      headline: 'Getting every corps member to camp.',
      body: 'Some body copy.',
      values: [{ icon_key: 'community', title: 'Community', description: 'For corps members.' }],
      stats: [{ id: 'institutions', label: 'Partner institutions', value: '64' }],
    };

    const model = mapAboutContent(dto);

    expect(model.eyebrow).toBe('About CorpersLink');
    expect(model.values).toHaveLength(1);
    expect(model.values[0]?.iconKey).toBe('community');
    expect(model.stats[0]?.value).toBe('64');
  });
});
