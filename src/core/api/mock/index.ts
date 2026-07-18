import type { HttpMethod } from './mock-router';
import { mockRouter } from './mock-router';

// Side-effect imports: each handler module registers its routes on import.
// Add new feature handler files here as the app grows.
import './handlers/site.handlers';
import './handlers/landing.handlers';
import './handlers/about.handlers';
import './handlers/testimonials.handlers';
import './handlers/faq.handlers';
import './handlers/support.handlers';
import './handlers/legal.handlers';
import './handlers/auth.handlers';
import './handlers/institutions.handlers';
import './handlers/booking.handlers';
import './handlers/account.handlers';

export async function dispatchMockRequest(
  method: HttpMethod,
  path: string,
  options: { query?: Record<string, unknown>; body?: unknown } = {},
): Promise<unknown> {
  return mockRouter.resolve(method, path, options.query ?? {}, options.body);
}
