import { describe, expect, it } from 'vitest';

import type { FaqItemDTO } from '@/features/faq/types';

import { buildFaqContent, mapFaqItem } from './faq.mapper';

describe('mapFaqItem', () => {
  it('maps every field unchanged', () => {
    const dto: FaqItemDTO = { id: 1, question: 'Q?', answer: 'A.', category: 'booking' };
    expect(mapFaqItem(dto)).toEqual(dto);
  });
});

describe('buildFaqContent', () => {
  it('wraps the items array with static page copy', () => {
    const items = [{ id: 1, question: 'Q1?', answer: 'A1.', category: 'booking' }];
    const content = buildFaqContent(items);

    expect(content.headline).toBe('Frequently asked questions');
    expect(content.items).toBe(items);
  });
});
