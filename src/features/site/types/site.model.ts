export interface NavLink {
  label: string;
  href: string;
}

export interface SiteChrome {
  navLinks: NavLink[];
  footerDisclaimer: string;
  footerCopyright: string;
}
