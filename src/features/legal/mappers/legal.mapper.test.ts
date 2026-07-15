import { describe, expect, it } from 'vitest';

import type { LegalContentDTO } from '@/features/legal/types';

import { mapLegalContent, mapLegalSection } from './legal.mapper';

describe('mapLegalSection', () => {
  it('maps heading/body unchanged', () => {
    expect(mapLegalSection({ heading: 'H', body: 'B' })).toEqual({ heading: 'H', body: 'B' });
  });
});

describe('mapLegalContent', () => {
  it('maps headline/subheadline and the nested sections array', () => {
    const dto: LegalContentDTO = {
      headline: 'Privacy Policy',
      subheadline: 'Effective 1 July 2026',
      sections: [{ heading: '1. What we collect', body: 'Your name and email.' }],
    };

    const model = mapLegalContent(dto);

    expect(model.headline).toBe('Privacy Policy');
    expect(model.sections).toEqual([
      { heading: '1. What we collect', body: 'Your name and email.' },
    ]);
  });
});
