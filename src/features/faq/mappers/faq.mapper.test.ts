import { describe, expect, it } from 'vitest';

import type { FaqContentDTO } from '@/features/faq/types';

import { mapFaqContent, mapFaqItem } from './faq.mapper';

describe('mapFaqItem', () => {
  it('maps question/answer unchanged', () => {
    expect(mapFaqItem({ question: 'Q?', answer: 'A.' })).toEqual({ question: 'Q?', answer: 'A.' });
  });
});

describe('mapFaqContent', () => {
  it('maps headline/subheadline and the nested items array', () => {
    const dto: FaqContentDTO = {
      headline: 'FAQ',
      subheadline: 'Answered',
      items: [{ question: 'Q1?', answer: 'A1.' }],
    };

    const model = mapFaqContent(dto);

    expect(model.headline).toBe('FAQ');
    expect(model.items).toEqual([{ question: 'Q1?', answer: 'A1.' }]);
  });
});
