# CorpersLink API Contract — Public Pages

This document specifies every HTTP endpoint the web app's seven public
pages depend on (Landing, About, Testimonials, FAQ, Support, Privacy,
Terms) plus the shared site chrome (header nav + footer). It is the
contract the mock backend (`src/core/api/mock`) implements today, and the
contract the real backend must satisfy for `VITE_USE_MOCK_API=false` to
work as a drop-in replacement.

- **Base URL:** `VITE_API_BASE_URL` (e.g. `https://corpslink-api.test/api/v1`)
- **Format:** JSON over HTTPS
- **Auth:** None of the landing-page endpoints below require authentication.
  When authenticated endpoints are added later, the client sends
  `Authorization: Bearer <token>` automatically (see `src/core/api/axios.ts`);
  the token is read from `localStorage["corperslink.auth.token"]`.

## Conventions

### Success envelope

Every endpoint returns HTTP 200/201 with this shape:

```json
{
  "success": true,
  "data": { "...": "endpoint-specific payload" },
  "meta": {
    "requestId": "req_01hxyz",
    "timestamp": "2026-07-15T09:00:00.000Z",
    "pagination": {
      "page": 1,
      "perPage": 10,
      "total": 42,
      "totalPages": 5
    }
  }
}
```

`meta.pagination` is present only on paginated list endpoints.

### Error envelope

Every non-2xx response returns:

```json
{
  "success": false,
  "message": "Human-readable summary",
  "code": "MACHINE_READABLE_CODE",
  "errors": {
    "email": ["Enter a valid email address."]
  }
}
```

`errors` is present only for `422 Unprocessable Entity` (field-level
validation failures).

### Status codes used

| Status | Meaning | Client-side `AppError.kind` |
|---|---|---|
| 200 | OK | — |
| 400 | Bad request | `unknown` |
| 401 | Unauthenticated | `unauthorized` |
| 403 | Forbidden | `forbidden` |
| 404 | Not found | `not_found` |
| 422 | Validation failed | `validation` |
| 429 | Rate limited | `rate_limited` |
| 500 | Server error | `server` |
| — | Network/timeout/offline | `network` / `timeout` / `offline` |

### Pagination, search, sorting, filtering

List endpoints accept these query parameters (none of the current
landing-page endpoints are paginated lists, but the mock backend's
`paginateAndSearch` helper implements this contract for future
list endpoints — e.g. institutions, bookings):

| Param | Type | Default | Description |
|---|---|---|---|
| `page` | integer ≥ 1 | `1` | Page number |
| `perPage` | integer ≥ 1 | `10` | Items per page |
| `search` | string | — | Case-insensitive substring match across the endpoint's searchable fields |
| `sortBy` | string | endpoint default | Field to sort by |
| `sortOrder` | `asc` \| `desc` | `asc` | Sort direction |
| `filters[...]` | string/number/boolean | — | Endpoint-specific filters |

---

## `GET /site/chrome`

Shared header navigation links and footer copy, fetched once by
`DefaultLayout` and reused across every page.

**Auth:** none · **Pagination:** none

### Response `200`

```json
{
  "success": true,
  "data": {
    "nav_links": [
      { "label": "Home", "href": "/" },
      { "label": "About", "href": "/about" },
      { "label": "Testimonials", "href": "/testimonials" },
      { "label": "FAQ", "href": "/faq" },
      { "label": "Support", "href": "/support" }
    ],
    "footer_disclaimer": "CorpersLink is an independent transportation platform ...",
    "footer_copyright": "© 2026 CorpersLink · Lagos, Nigeria"
  }
}
```

---

## `GET /landing/stats`

Hero banner statistics (seats booked, participating institutions, average
rating).

**Auth:** none · **Pagination:** none

### Response `200`

```json
{
  "success": true,
  "data": [
    {
      "id": "seats-booked",
      "label": "Seats booked this season",
      "value": 12480,
      "value_suffix": null,
      "display_format": "number"
    },
    {
      "id": "participating-institutions",
      "label": "Participating institutions",
      "value": 64,
      "value_suffix": null,
      "display_format": "number"
    },
    {
      "id": "average-rating",
      "label": "Average rider rating",
      "value": 4.8,
      "value_suffix": null,
      "display_format": "rating"
    }
  ]
}
```

`display_format` is one of `number` | `decimal` | `rating` and controls how
`landing.mapper.ts` formats `value` into the domain model's `displayValue`
(e.g. `12,480`, `12.5%`, `4.8 ★`).

### DTO → Domain mapping

| DTO field (`HeroStatDTO`) | Domain field (`HeroStat`) |
|---|---|
| `id` | `id` |
| `label` | `label` |
| `value` + `value_suffix` + `display_format` | `displayValue` (formatted string) |

---

## `GET /landing/how-it-works`

The three-step "how it works" cards.

**Auth:** none · **Pagination:** none

### Response `200`

```json
{
  "success": true,
  "data": [
    {
      "step_number": 1,
      "title": "Find your institution",
      "description": "Search the verified list of participating schools and see every vehicle scheduled for your camp.",
      "icon_path": "search-institution"
    },
    {
      "step_number": 2,
      "title": "Pick your exact seat",
      "description": "Choose from the live seat map — available, held and occupied — and lock yours before it's gone.",
      "icon_path": "seat-map"
    },
    {
      "step_number": 3,
      "title": "Pay & ride with proof",
      "description": "Pay the published fare securely. Your e-receipt and manifest entry are generated instantly.",
      "icon_path": "secure-payment"
    }
  ]
}
```

The repository sorts the mapped result by `stepNumber` client-side, so the
backend is free to return steps in any order.

---

## `GET /landing/content`

Static hero copy for the landing page only — nav links and footer copy
live under `/site/chrome` instead (see above), since they're shared by
every page rather than owned by landing.

**Auth:** none · **Pagination:** none

### Response `200`

```json
{
  "success": true,
  "data": {
    "eyebrow_badge": "2026 BATCH B BOOKING NOW OPEN",
    "headline": "Book your seat to camp in minutes.",
    "subheadline": "Reserve a verified seat on your institution's NYSC camp transport, pay securely, and get your receipt instantly.",
    "primary_cta_label": "Get started — it's free",
    "secondary_cta_label": "See how it works",
    "hero_image_url": "/images/hero-corps-member.png",
    "hero_image_alt": "A corps member checks her trip details on her phone beside a CorpersLink bus at the Student Union departure point."
  }
}
```

---

## `POST /landing/newsletter-signup`

Captures an email address from the CTA banner's "Notify me" form
(pre-launch interest capture — not a full account registration).

**Auth:** none

### Request body

```json
{ "email": "student@example.com" }
```

### Response `200`

```json
{
  "success": true,
  "data": {
    "email": "student@example.com",
    "subscribed": true,
    "subscribed_at": "2026-07-15T09:00:00.000Z"
  }
}
```

### Validation errors — `422`

| Condition | `errors.email` |
|---|---|
| Missing/empty email | `["Email address is required."]` |
| Malformed email | `["Enter a valid email address."]` |

```json
{
  "success": false,
  "message": "Some fields need your attention before continuing.",
  "code": "VALIDATION_ERROR",
  "errors": { "email": ["Enter a valid email address."] }
}
```

### Server error — `500`

The mock backend deliberately fails any address ending in `@fails.test` so
the error-state UI and `AppError.kind === 'server'` path can be exercised
in development/tests without special flags:

```json
{
  "success": false,
  "message": "Something went wrong on our end. Please try again shortly.",
  "code": "INTERNAL_SERVER_ERROR"
}
```

---

## `GET /about/content`

About page copy: mission statement, value propositions, and company
stats.

**Auth:** none · **Pagination:** none

### Response `200`

```json
{
  "success": true,
  "data": {
    "eyebrow": "About CorpersLink",
    "headline": "Getting every corps member to camp — safely, fairly, on time.",
    "body": "CorpersLink was born out of a familiar scene: ...",
    "values": [
      {
        "icon_key": "verified",
        "title": "Verified, end to end",
        "description": "Every transporter is vetted and every vehicle is registered with your institution before it appears on CorpersLink."
      }
    ],
    "stats": [
      { "id": "founded", "label": "Founded in Lagos", "value": "2024" }
    ]
  }
}
```

`icon_key` is one of `verified` | `fair-fares` | `community` — the
frontend maps each to a local icon, so the backend never sends markup or
SVG paths.

---

## `GET /testimonials/content`

Rated rider testimonials plus the page's aggregate rating summary.

**Auth:** none · **Pagination:** none

### Response `200`

```json
{
  "success": true,
  "data": {
    "eyebrow": "Testimonials",
    "headline": "Corps members who arrived stress-free",
    "rating_summary": "4.8 average from 3,214 verified riders · 2026 Batch A & B",
    "testimonials": [
      {
        "stars": 5,
        "quote": "I booked Seat 3 from my hostel the night before and just walked onto the bus at the gate.",
        "initials": "AO",
        "avatar_color": "#1F3A5F",
        "name": "Adaeze O.",
        "meta": "UNILAG — Iyana-Ipaja Camp"
      }
    ]
  }
}
```

---

## `GET /faq/content`

Frequently asked questions, rendered as an accordion (open/closed state is
client-side only — the backend just returns question/answer pairs).

**Auth:** none · **Pagination:** none

### Response `200`

```json
{
  "success": true,
  "data": {
    "headline": "Frequently asked questions",
    "subheadline": "Booking, payment and departure — answered",
    "items": [
      {
        "question": "How do I change my selected seat?",
        "answer": "Before payment, tap your held seat again to release it and pick another ..."
      }
    ]
  }
}
```

---

## `GET /support/content`

Support page copy: FAQ preview list, institution transport-desk contact
details, and the refund-policy notice.

**Auth:** none · **Pagination:** none

### Response `200`

```json
{
  "success": true,
  "data": {
    "headline": "How can we help?",
    "subheadline": "Common questions about booking, payment and departure",
    "faq_preview": ["How do I change my selected seat?"],
    "contact": {
      "institution_name": "University of Lagos",
      "hours": "Mon–Fri, 9 AM–5 PM",
      "phone": "0700-CORPERSLINK",
      "email": "transport@unilag.edu.ng"
    },
    "refund_notice": "Refunds and manifest changes are handled by your institution — CorpersLink support cannot alter published fares."
  }
}
```

---

## `GET /privacy/content`

Privacy Policy copy, rendered as a headline + a stack of numbered
sections. Shares the same `LegalContentDTO` shape as `/terms/content` —
both are served by the `legal` feature's single `LegalRepository`.

**Auth:** none · **Pagination:** none

### Response `200`

```json
{
  "success": true,
  "data": {
    "headline": "Privacy Policy",
    "subheadline": "Effective 1 July 2026 · Compliant with the Nigeria Data Protection Regulation (NDPR)",
    "sections": [
      {
        "heading": "1. What we collect",
        "body": "Your name, email, phone number, NYSC call-up number, optional state code, and next-of-kin contact details — only what's needed to book and manifest your trip."
      }
    ]
  }
}
```

---

## `GET /terms/content`

Terms & Conditions copy. Identical shape to `/privacy/content` above.

**Auth:** none · **Pagination:** none

### Response `200`

```json
{
  "success": true,
  "data": {
    "headline": "Terms & Conditions",
    "subheadline": "Effective 1 July 2026 · Iterationplus Technologies Ltd",
    "sections": [
      {
        "heading": "1. Eligibility & accounts",
        "body": "CorpersLink is for prospective corps members of participating institutions. You must register with your own details and keep your sign-in credentials confidential."
      }
    ]
  }
}
```

---

## Adding a new endpoint

1. Add the path to `src/core/constants/api-endpoints.ts`.
2. Define the wire DTO in `src/features/<feature>/types/*.dto.ts` and the
   domain model in `*.model.ts`.
3. Write the mapper in `src/features/<feature>/mappers/`.
4. Implement `get/post/...` calls in the feature's repository
   (`ILandingRepository`-style interface + concrete class).
5. Add a mock handler under `src/core/api/mock/handlers/` (register it in
   `src/core/api/mock/index.ts`) with realistic seed data, and mirror the
   contract in this document.
6. The real backend team implements the same contract; no frontend code
   changes when `VITE_USE_MOCK_API=false`.
