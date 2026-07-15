export interface SiteNavLinkDTO {
  label: string;
  href: string;
}

/**
 * Cross-page chrome: primary navigation + footer content shared by every
 * route (header, footer). Deliberately separate from the landing feature's
 * own content — landing owns its hero copy only.
 */
export interface SiteChromeDTO {
  nav_links: SiteNavLinkDTO[];
  footer_disclaimer: string;
  footer_copyright: string;
}
