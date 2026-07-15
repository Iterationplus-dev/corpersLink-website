# CorpersLink Web

The CorpersLink landing page — an enterprise-grade Vue 3 + TypeScript
foundation for the CorpersLink web application. Books verified seats on
institution-run NYSC camp transport; this repository currently implements
the **public landing page** on top of an architecture designed to scale to
the full corps-member and institution web app.

Runs immediately after cloning — **no backend required**. A fully typed,
in-memory mock API ships in the box and is on by default.

---

## Table of contents

- [Project overview](#project-overview)
- [Tech stack](#tech-stack)
- [Installation](#installation)
- [Development](#development)
- [Build](#build)
- [Folder structure](#folder-structure)
- [Architecture](#architecture)
- [Environment variables](#environment-variables)
- [Mock backend](#mock-backend)
- [Switching to the real backend](#switching-to-the-real-backend)
- [API contract](#api-contract)
- [Scripts](#scripts)
- [Coding standards](#coding-standards)
- [Testing](#testing)
- [Deployment](#deployment)
- [Future improvements](#future-improvements)

---

## Project overview

This is the **web** counterpart to the existing Ionic Vue 3 + Capacitor
mobile app, sharing the same business vocabulary, data shapes, and API
contracts where applicable. Scope of this repository, by design:

- ✅ Seven public marketing pages, sharing one header/footer shell:
  - **Landing** (`/`) — hero, stats, "how it works", CTA email capture.
  - **About** (`/about`) — mission, values, company stats.
  - **Testimonials** (`/testimonials`) — rated rider quotes + CTA.
  - **FAQ** (`/faq`) — accordion of booking/payment/departure questions.
  - **Support** (`/support`) — live chat + institution contact card + FAQ preview.
  - **Privacy** (`/privacy`) and **Terms** (`/terms`) — legal copy, sharing
    one `legal` feature and presentational component since both pages are
    the same shape (headline + numbered sections).
- ✅ The full enterprise scaffolding needed to grow this into the rest of
  the corps-member web app (auth, dashboard, booking flow, etc.) without
  re-architecting: layered API access, repository/service pattern, typed
  domain models, centralized error handling, Pinia state, routing.
- ❌ No account pages are implemented yet (sign-in, dashboard, seat
  booking...). The header's "Sign in" and "Book a seat" affordances are
  visually present but intentionally inert (or link back to the landing
  page's CTA) until those flows are built — see
  [Future improvements](#future-improvements).

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Vue 3 (Composition API only, `<script setup>`) |
| Language | TypeScript (strict mode, no `any`) |
| Build tool | Vite |
| Routing | Vue Router 4 |
| State | Pinia |
| HTTP | Axios (real backend) / in-memory mock adapter (default) |
| Utilities | VueUse-style hand-rolled composables (`useOnlineStatus`, etc.) |
| Testing | Vitest + @vue/test-utils + jsdom |
| Linting/formatting | ESLint (`@vue/eslint-config-typescript`) + Prettier |

## Installation

```bash
git clone <repo-url>
cd corpersLink-website
npm install
```

That's it — a working `.env` with mock-mode defaults is already committed
(see [Environment variables](#environment-variables)), so no further setup
is required.

## Development

```bash
npm run dev
```

Opens the Vite dev server (default `http://localhost:5173`) with all five
pages served entirely from the mock backend — hot reload, source maps, and
all.

## Build

```bash
npm run build     # type-checks (vue-tsc) then produces dist/
npm run preview    # serve the production build locally
```

## Folder structure

```
src/
├── assets/illustrations/       Static image assets (hero photo, webp variant)
├── components/
│   ├── layout/                 AppHeader / AppFooter — shared page chrome
│   └── ui/                     App-wide, feature-agnostic UI primitives
│                                (BaseButton, SkeletonBlock, PageSkeleton, ErrorState, LogoMark, ...)
├── composables/                 Generic, reusable composables
│                                (useOnlineStatus, useAsyncResource)
├── core/
│   ├── api/
│   │   ├── axios.ts            Real-backend axios instance + interceptors
│   │   ├── client.ts            ApiClient interface + Http/Mock implementations
│   │   ├── error-normalizer.ts  Converts any error (axios or mock) into AppError
│   │   └── mock/                In-memory mock backend (see below)
│   ├── config/env.ts            Single source of truth for import.meta.env
│   ├── constants/                HTTP status codes, API endpoint paths
│   ├── types/                    ApiSuccessResponse/ApiErrorResponse, AppError
│   └── utils/logger.ts           Logging facade
├── features/
│   ├── site/                    Shared chrome: nav links + footer copy
│   ├── landing/                 Hero, stats, how-it-works, newsletter CTA
│   ├── about/                   Mission, values, company stats
│   ├── testimonials/            Rated rider quotes
│   ├── faq/                     Accordion of booking/payment questions
│   ├── support/                 Live chat + institution contact + FAQ preview
│   └── legal/                   Shared Privacy/Terms content shape + view
│       (each feature follows the same shape:)
│       ├── components/          Feature-only presentational components
│       ├── composables/         use<Feature>Page (fetch-on-mount + loading/error)
│       ├── mappers/              DTO -> domain model mapping functions
│       ├── repository/           I<Feature>Repository + axios/mock-backed impl
│       ├── services/             <Feature>Service (business-logic orchestration)
│       ├── types/                *.dto.ts (wire format) + *.model.ts (domain)
│       └── views/                Route-level view composing the section components
├── layouts/DefaultLayout.vue     Shell: skip link, AppHeader, <router-view>, AppFooter
├── router/                       Route table + router instance
├── stores/                       Pinia stores (ui.store, site.store, landing.store)
├── styles/                       Design tokens (tokens.css) + reset (base.css)
├── App.vue
└── main.ts
```

Adding a new page (e.g. `booking`) means copying this same
`components/composables/mappers/repository/services/types/views` shape
under `features/booking/`, then adding one route in `router/routes.ts` —
nothing in `core/` needs to change.

About, Testimonials, FAQ and Support intentionally do **not** get their own
Pinia store: their data is read once by a single view and never shared
across components, so `useAsyncResource` (a generic fetch-on-mount
loading/error/retry composable) is enough. Landing and the shared site
chrome (`site.store.ts`) *do* use Pinia, because their state is consumed by
multiple components simultaneously (hero + stats row; header + footer).

## Architecture

Strict one-directional dependency flow, enforced by convention (and easy to
lint-enforce later with `eslint-plugin-boundaries` if the codebase grows):

```
Component (.vue)
   │  calls
   ▼
Composable (useLandingPage / use<Feature>Page via useAsyncResource)
   │  reads/calls actions on (landing, site) or wraps directly (about/testimonials/faq/support)
   ▼
Pinia store (API state, where shared) — otherwise the composable holds it
   │  delegates business logic to
   ▼
Service (<Feature>Service — combines/validates, no HTTP knowledge)
   │  depends on interface
   ▼
Repository (I<Feature>Repository -> <Feature>Repository)
   │  depends on interface
   ▼
ApiClient (HttpApiClient | MockApiClient)
   │
   ▼
Axios (real backend)  OR  Mock router (src/core/api/mock)
```

Key design decisions:

- **Repository pattern + dependency injection.** `LandingRepository`
  depends on the `ApiClient` *interface*, never on axios or the mock
  router directly. Tests construct it with an in-memory fake client — see
  `landing.repository.test.ts`.
- **DTO → Mapper → Domain model**, always. `src/features/landing/types`
  splits `*.dto.ts` (exact wire shape, snake_case, matches the real API)
  from `*.model.ts` (camelCase, UI-ready, pre-formatted). Components never
  import a `*DTO` type — only mappers and repositories do.
- **Centralized error handling.** Every failure — axios error, mock
  adapter error, offline, timeout — passes through
  `core/api/error-normalizer.ts` and comes out the other side as a single
  `AppError` with a `kind` (`validation | unauthorized | forbidden |
  not_found | rate_limited | server | network | timeout | offline |
  unknown`). Components/composables only ever branch on `AppError`, never
  on `AxiosError` or mock-specific shapes.
- **State separation.** Pinia stores hold *API state* (`landing.store.ts`:
  fetched data, loading/error status). Cross-cutting *UI state*
  (`ui.store.ts`: mobile nav open, offline banner) is separate. Purely
  local UI state (a form's input value) lives in a composable
  (`useNewsletterForm`), not in Pinia at all.
- **Environment-driven backend selection.** `core/config/env.ts` is the
  only file that reads `import.meta.env`. `core/api/client.ts` picks
  `HttpApiClient` or `MockApiClient` once, at module load, based on
  `env.useMockApi` — every repository is written against the same
  `ApiClient` interface either way.

## Environment variables

| Variable | Default (committed `.env`) | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `https://corpslink-api.test/api/v1` | Base URL of the real backend. Ignored in mock mode. |
| `VITE_USE_MOCK_API` | `true` | `true` → in-memory mock backend. `false` → real HTTP calls via axios. |
| `VITE_MOCK_LATENCY_MS` | `450` | Artificial network delay (±20% jitter) added to every mock response, so loading/skeleton states behave realistically. |
| `VITE_API_TIMEOUT_MS` | `15000` | Request timeout applied to the axios client. |

Copy `.env.example` to `.env.local` to override any of these without
touching the committed defaults (`.env.local` is git-ignored). If no env
var is set at all — e.g. a variable is stripped in some deployment step —
`core/config/env.ts` still defaults `useMockApi` to `true`, so the app
never fails to boot for lack of configuration.

## Mock backend

Lives entirely under `src/core/api/mock/`:

| File | Responsibility |
|---|---|
| `mock-router.ts` | Tiny Express-like router — `register(method, path, handler)` / `resolve(...)`, supports `:param` segments |
| `mock-response.ts` | `mockSuccess`, `mockValidationError` (422), `mockServerError` (500), `mockNotFoundError` (404), `paginateAndSearch` (search + pagination helper for future list endpoints) |
| `mock-http-error.ts` | `MockHttpError` — shaped so `error-normalizer.ts` treats it identically to a real axios failure |
| `latency.ts` | Simulates network latency (`VITE_MOCK_LATENCY_MS` ± 20% jitter) |
| `seed/landing.seed.ts` | Realistic seed data matching the approved design spec (hero stats, how-it-works copy, disclaimer, nav links) |
| `handlers/landing.handlers.ts` | Registers the four landing endpoints against the router |
| `index.ts` | Imports every `handlers/*` module (side-effect registration) and exposes `dispatchMockRequest` |

It simulates, end to end:

- ✅ Realistic seeded data (hero stats, how-it-works, content copy)
- ✅ CRUD-style handlers (`get*`, `post` newsletter signup)
- ✅ Pagination + search (`paginateAndSearch` — ready for the next list
  endpoint, e.g. institutions)
- ✅ Loading states (artificial latency)
- ✅ Validation errors (`422` with field-level messages — try submitting
  the CTA form with a malformed email)
- ✅ Server errors (`500` — try `POST /landing/newsletter-signup` with an
  email ending in `@fails.test`)
- ✅ Auth header wiring (`core/api/axios.ts` attaches a bearer token from
  `localStorage` when present — ready for the first authenticated
  endpoint)

## Switching to the real backend

1. Set `VITE_USE_MOCK_API=false`.
2. Set `VITE_API_BASE_URL` to the real API's base URL.
3. Ensure the backend implements the contract in [docs/API.md](docs/API.md)
   exactly (same success/error envelopes, same field names).

No other code changes. `core/api/client.ts` swaps `MockApiClient` for
`HttpApiClient` at module load based on `env.useMockApi` alone — every
repository, service, store, and component is written against the same
`ApiClient` interface either way.

## API contract

Full endpoint-by-endpoint documentation — methods, request/response
shapes, validation rules, error codes, and examples — lives in
[docs/API.md](docs/API.md).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`vue-tsc -b`) then production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Type-check only, no emit |
| `npm run lint` | ESLint with `--fix` |
| `npm run lint:check` | ESLint, no autofix (CI-friendly) |
| `npm run format` | Prettier `--write` |
| `npm run format:check` | Prettier `--check` (CI-friendly) |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Vitest with V8 coverage report |

## Coding standards

- **Composition API only** — no Options API, anywhere.
- **No `any`** — enforced by `@typescript-eslint/no-explicit-any: error`.
  Unknown external data is typed `unknown` and narrowed explicitly (see
  `error-normalizer.ts`).
- **DTOs never reach components.** If you're tempted to import a `*DTO`
  type into a `.vue` file, add a mapper instead.
- **One `ApiClient` interface, two implementations.** Never import
  `httpClient` (axios) or `dispatchMockRequest` (mock) outside of
  `core/api/client.ts`.
- **Errors are always `AppError`** by the time they reach a
  composable/component. Never branch on `AxiosError` or `MockHttpError`
  outside of `core/api/`.
- ESLint (`@vue/eslint-config-typescript`, `plugin:vue/vue3-recommended`)
  and Prettier run on every file; `npm run lint:check` / `format:check`
  are meant to be wired into CI.

## Testing

63 Vitest tests cover every layer that has real logic:

| Layer | Test file(s) |
|---|---|
| Error normalization | `core/api/error-normalizer.test.ts` |
| Mock backend helpers (pagination/search/error builders) | `core/api/mock/mock-response.test.ts` |
| DTO → domain mappers | one `*.mapper.test.ts` per feature (`landing`, `site`, `about`, `testimonials`, `faq`, `support`, `legal`) |
| Repository | one `*.repository.test.ts` per feature |
| Service (business logic orchestration) | `features/landing/services/landing.service.test.ts` |
| Pinia store (API state machine: idle/loading/success/error) | `stores/landing.store.test.ts` |
| Generic composables | `composables/useOnlineStatus.test.ts`, `composables/useAsyncResource.test.ts` |

Run them with `npm test` (single run) or `npm run test:watch`.

All five pages have additionally been manually verified end-to-end in a
real headless-Chromium session (desktop 1360px and mobile 412px
viewports): header/hero/how-it-works/CTA/footer render correctly on
landing; About/Testimonials/FAQ/Support render their content, the FAQ
accordion opens/closes on click, the mobile nav drawer opens/closes,
SPA navigation between all five routes works via `<router-link>` with no
full page reloads, and the newsletter form exercises both the 422
validation path and the success path against the mock backend — all with
zero console errors.

## Deployment

This is a static single-page app after `npm run build` — `dist/` can be
served by any static host (Nginx, Netlify, Vercel, S3+CloudFront, etc.).

- Configure the host to rewrite all paths to `/index.html` (SPA fallback),
  since `vue-router` uses `createWebHistory`.
- Set `VITE_API_BASE_URL` / `VITE_USE_MOCK_API` at **build time** (Vite
  inlines `import.meta.env.*` into the bundle) — i.e. run a separate build
  per environment, or use your host's build-time env injection.
- Ship `VITE_USE_MOCK_API=false` for every real deployment; mock mode is a
  local-development/demo convenience only.

## Future improvements

- Build the account/booking flows (sign-in, registration, institution
  picker, seat map, payment, dashboard) and wire the header's "Sign in" /
  "Book a seat" affordances to them.
- Add an institutions list endpoint exercising `paginateAndSearch` for
  real (search + pagination already implemented in the mock layer,
  unused until that page exists).
- Replace `localStorage` token storage with an httpOnly-cookie-based
  session once the auth backend is defined.
- Add Playwright/Cypress e2e coverage now that there are multiple routes
  to click between (the manual Chromium session run during development
  covered this ad hoc; formalizing it as a checked-in test suite is the
  natural next step).
- Consider `eslint-plugin-boundaries` to make the layering rules in
  [Architecture](#architecture) machine-enforced instead of convention-only.
