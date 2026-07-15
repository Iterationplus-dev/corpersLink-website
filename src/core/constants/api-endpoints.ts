/**
 * Centralized endpoint registry. Both the real axios client and the mock
 * adapter key off these exact paths, so a repository never hardcodes a URL.
 */
export const ApiEndpoints = {
  site: {
    chrome: '/site/chrome',
  },
  landing: {
    stats: '/landing/stats',
    howItWorks: '/landing/how-it-works',
    content: '/landing/content',
    newsletter: '/landing/newsletter-signup',
  },
  about: {
    content: '/about/content',
  },
  testimonials: {
    content: '/testimonials/content',
  },
  faq: {
    content: '/faq/content',
  },
  support: {
    content: '/support/content',
  },
  privacy: {
    content: '/privacy/content',
  },
  terms: {
    content: '/terms/content',
  },
} as const;
