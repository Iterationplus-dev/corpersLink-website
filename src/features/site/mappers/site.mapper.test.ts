import { describe, expect, it } from 'vitest';

import type { SiteChromeDTO } from '@/features/site/types';

import { mapSiteChrome } from './site.mapper';

describe('mapSiteChrome', () => {
  it('maps nav links and footer copy to camelCase domain fields', () => {
    const dto: SiteChromeDTO = {
      nav_links: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
      ],
      footer_disclaimer: 'CorpersLink is independent.',
      footer_copyright: '© 2026 CorpersLink',
    };

    const model = mapSiteChrome(dto);

    expect(model.navLinks).toEqual([
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
    ]);
    expect(model.footerDisclaimer).toBe('CorpersLink is independent.');
    expect(model.footerCopyright).toBe('© 2026 CorpersLink');
  });
});
