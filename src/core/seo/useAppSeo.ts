import { useHead } from '@unhead/vue';
import { useRoute } from 'vue-router';

import { absoluteUrl, siteConfig } from './site-config';

/**
 * Drives <title>, description, canonical, robots, Open Graph and Twitter
 * Card tags from the active route's `meta` — set once at the app root so
 * every navigation updates the document head reactively.
 *
 * Per-route fields (all optional, see `router/routes.ts`):
 *  - `meta.description` — falls back to `siteConfig.defaultDescription`.
 *  - `meta.robots` — falls back to `'index, follow'`; private/app routes
 *    should set `'noindex, nofollow'` explicitly.
 */
export function useAppSeo() {
  const route = useRoute();

  useHead({
    title: () => (route.meta.title as string | undefined) ?? siteConfig.defaultTitle,
    meta: () => {
      const title = (route.meta.title as string | undefined) ?? siteConfig.defaultTitle;
      const description = (route.meta.description as string | undefined) ?? siteConfig.defaultDescription;
      const robots = (route.meta.robots as string | undefined) ?? 'index, follow';
      const url = absoluteUrl(route.path);

      return [
        { name: 'description', content: description },
        { name: 'robots', content: robots },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: siteConfig.siteName },
        { property: 'og:locale', content: siteConfig.locale },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url },
        { property: 'og:image', content: absoluteUrl(siteConfig.defaultOgImage) },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: absoluteUrl(siteConfig.defaultOgImage) },
      ];
    },
    link: () => [{ rel: 'canonical', href: absoluteUrl(route.path) }],
  });
}
