import type { SiteChrome, SiteChromeDTO } from '@/features/site/types';

export function mapSiteChrome(dto: SiteChromeDTO): SiteChrome {
  return {
    navLinks: dto.nav_links.map((link) => ({ label: link.label, href: link.href })),
    footerDisclaimer: dto.footer_disclaimer,
    footerCopyright: dto.footer_copyright,
  };
}
