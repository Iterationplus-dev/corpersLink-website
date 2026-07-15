import { simulateLatency } from './latency';
import { mockNotFoundError } from './mock-response';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface MockRequestContext {
  params: Record<string, string>;
  query: Record<string, unknown>;
  body: unknown;
}

export type MockHandler = (ctx: MockRequestContext) => unknown | Promise<unknown>;

interface RegisteredRoute {
  pattern: RegExp;
  paramNames: string[];
  handler: MockHandler;
}

/**
 * Minimal Express-like router so mock handlers can use `/landing/:id` style
 * paths. Kept intentionally small — this is a test double, not a framework.
 */
class MockRouter {
  private routes: Record<HttpMethod, RegisteredRoute[]> = {
    get: [],
    post: [],
    put: [],
    patch: [],
    delete: [],
  };

  register(method: HttpMethod, path: string, handler: MockHandler): void {
    const paramNames: string[] = [];
    const patternSource = path
      .split('/')
      .map((segment) => {
        if (segment.startsWith(':')) {
          paramNames.push(segment.slice(1));
          return '([^/]+)';
        }
        return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      })
      .join('/');

    this.routes[method].push({
      pattern: new RegExp(`^${patternSource}/?$`),
      paramNames,
      handler,
    });
  }

  async resolve(
    method: HttpMethod,
    path: string,
    query: Record<string, unknown>,
    body: unknown,
  ): Promise<unknown> {
    await simulateLatency();

    const [pathname] = path.split('?');
    const candidates = this.routes[method];

    for (const route of candidates) {
      const match = route.pattern.exec(pathname ?? path);
      if (match) {
        const params: Record<string, string> = {};
        route.paramNames.forEach((name, index) => {
          params[name] = match[index + 1] ?? '';
        });
        return route.handler({ params, query, body });
      }
    }

    return mockNotFoundError(`Route ${method.toUpperCase()} ${path}`);
  }
}

export const mockRouter = new MockRouter();
