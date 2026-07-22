/**
 * Site-wide SEO defaults. `siteUrl` has no trailing slash — every consumer
 * appends its own leading `/`, so joining never produces a double slash.
 */
export const siteConfig = {
  siteUrl: 'https://corperslink.com',
  siteName: 'CorpersLink',
  defaultTitle: 'CorpersLink — Campus transport, sorted',
  defaultDescription:
    'CorpersLink - Book your verified seat to NYSC camp transport in minutes. Institution-run buses, secure payments, confirmed manifests.',
  /** Falls back to this until a real 1200x630 brand image ships at this path. */
  defaultOgImage: '/og-image.png',
  locale: 'en_NG',
} as const;

export function absoluteUrl(path: string): string {
  return `${siteConfig.siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
