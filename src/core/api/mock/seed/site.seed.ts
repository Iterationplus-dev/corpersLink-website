import type { SiteChromeDTO } from '@/features/site/types';

export const siteChromeSeed: SiteChromeDTO = {
  nav_links: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Testimonials', href: '/testimonials' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Support', href: '/support' },
  ],
  footer_disclaimer:
    'CorpersLink is an independent transportation platform designed to assist prospective and serving corps members with travel arrangements. It is not affiliated with, endorsed by, sponsored by, or operated by the National Youth Service Corps (NYSC). All NYSC names, trademarks, and related references remain the property of their respective owners.',
  footer_copyright: '© 2026 CorpersLink. All rights reserved.',
};
