import { describe, expect, it } from 'vitest';

import type { SupportContentDTO } from '@/features/support/types';

import { mapSupportContact, mapSupportContent } from './support.mapper';

describe('mapSupportContact', () => {
  it('maps institution_name to camelCase institutionName', () => {
    const model = mapSupportContact({
      institution_name: 'CorpersLink Nig',
      hours: 'Mon–Fri, 9 AM–5 PM',
      phone: '0700-CORPERSLINK',
      email: 'hello@corperslink.com',
    });

    expect(model.institutionName).toBe('CorpersLink Nig');
    expect(model.email).toBe('hello@corperslink.com');
  });
});

describe('mapSupportContent', () => {
  it('maps faq_preview and the nested contact object', () => {
    const dto: SupportContentDTO = {
      headline: 'How can we help?',
      subheadline: 'sub',
      faq_preview: ['Q1?'],
      contact: {
        institution_name: 'UNILAG',
        hours: 'hours',
        phone: 'phone',
        email: 'email',
      },
      refund_notice: 'notice',
    };

    const model = mapSupportContent(dto);

    expect(model.faqPreview).toEqual(['Q1?']);
    expect(model.contact.institutionName).toBe('UNILAG');
    expect(model.refundNotice).toBe('notice');
  });
});
