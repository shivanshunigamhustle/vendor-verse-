# VendorVerse PRS v3 Global Marketplace gap report

> **Superseded (2026-10-29).** Scope, phases and mockup status now live in [../../docs/01-feature-spec.md](../../docs/01-feature-spec.md), [../../docs/03-mockup-sync-matrix.md](../../docs/03-mockup-sync-matrix.md) and [../../docs/04-decisions-log.md](../../docs/04-decisions-log.md). Kept for background; phase labels and counts below may be out of date.


Audited: 24 October 2026

Source of product requirements: `VendorVerse_Comprehensive_PRS_v3_Global_Marketplace.docx`, including chapter 26. Its content is treated as product scope. This report records the current browser implementation and the work required to reach the specified product behavior.

## Current architecture

| Area | Current implementation | Files |
| --- | --- | --- |
| Framework | Vite + React 19 + Tailwind CSS v4 utilities | `package.json`, `src/main.jsx`, `src/index.css` |
| Routing | In-memory stack navigator and screen registry | `src/nav.jsx`, `src/registry.jsx`, `src/App.jsx` |
| State | React context with seeded, in-memory arrays; state resets on refresh | `src/store.jsx`, `src/data.jsx` |
| Design system | Shared `Screen`, card, form, dialog, sheet, badge and chart components; scoped customer/vendor/agent/admin visual CSS | `src/ui.jsx`, `src/screens/*-visuals.css` |
| Authentication | Role-select login and OTP flow; client-side validation only | `src/screens/auth.jsx` |
| Tests and checks | Build script only; no lint, type-check or test scripts configured | `package.json` |

## Protected existing journeys

- Public marketplace landing, category browsing, search, listing and vendor profile discovery.
- Customer sign-in, OTP, profile, saved items, comparison, RFQ, quotation, messages, review and support routes.
- Vendor registration, verification status, listing management, RFQs, booking actions, messages, reports, reviews and profile routes.
- Sales Agent lead creation, follow-ups, assisted onboarding, commission and profile routes.
- Super Admin approvals, vendor/listing review, users, roles, categories, agents, disputes, reports, settings and audit routes.
- Existing website shell, desktop sidebars, mobile navigation, responsive visual themes and direct logout-to-home behavior.

## Requirement coverage

| PRS area | Status | Evidence | Gap to close |
| --- | --- | --- | --- |
| §1–§2 purpose, release scope and payment boundary | Partial | Marketplace, service bookings and RFQs exist | Product checkout remains in legacy data and copy; release boundaries are not consistently enforced |
| §3 account model and four roles | Partial | Customer, Vendor, Sales Agent and Super Admin routes exist | One identity cannot switch between customer/vendor contexts; account state handling is incomplete |
| §4 RBAC and authorization | Partial | Route-level role check and role-specific navigation | No deny-by-default service authorization or record ownership enforcement on every action |
| §5 vendor onboarding, verification and publication | Partial | Vendor wizard, document states, reviewer actions and listing moderation | Country-first onboarding, L0–L4 levels, expiry gates, reviewer self-approval protection and computed publication gate are missing |
| §6 taxonomy and attributes | Partial | Admin category/subcategory/field editor | Taxonomy is fixed seed data; no lifecycle, country scope, merge, localized aliases, schema propagation or suggestion queue |
| §7 discovery, search, comparison and favorites | Partial | Search, filters, saved items and three-item comparison | No geography hierarchy, market activation, source-language, pagination, result rationale, currency-safe sorting or remote/ships-to logic |
| §8 service bookings | Partial | Customer booking request and vendor booking actions | No complete specified state machine, policy/terms snapshot, deadlines/reminders, recurring/instant mode or durable concurrency handling |
| §9 RFQs and quotations | Partial | RFQ creation, attachments, quote revision/history, compare and acceptance snapshot | No structured schema fields, deadline edit/extension, withdrawal, no-quote outcome, multi-currency or atomic service-layer acceptance |
| §10 messaging and notifications | Partial | Customer/vendor messages, attachment affordance and notifications | No participant authorization, privacy notice, message reports, durable delivery or notification preference rules |
| §11 subscriptions and sponsored visibility | Partial | Plan configuration and vendor plan display | No plan checkout, receipt/invoice, grace/expiry/restoration, lead usage or eligibility enforcement |
| §12 reviews, moderation, reports and disputes | Partial | Transaction-related review guard, vendor responses, support/dispute screens | No dimensions, review report/appeal, moderation queue or enforced eligibility in a service layer |
| §13 Super Admin operations | Partial | Verification/listing queues, disputes, settings, audit screen | Missing subscription/support/review appeal/category suggestion/market activation queues, dual approval and market filters |
| §14–§16 data model, integrations, privacy and security | Partial | Browser repository persists the existing record collections; authorization helpers provide a replaceable client boundary | No server authorization, normalized persistence, idempotency, attachment handling or production security controls |
| §17 non-functional requirements | Partial | Responsive CSS, reduced-motion styles and reusable controls | No performance/error/offline instrumentation, RTL support, formal accessibility audit or scalability design |
| §18 analytics and metrics | Partial | Vendor/admin reports and static charts | Metrics are largely fixture-based and not consistently computed from records |
| §19 UX states and screen inventory | Partial | Shared screens, forms, empty states, sheets and dialogs | Incomplete loading, retry, offline, expired and permission-denied states across screens |
| §20 SC-001–SC-046 scenarios | Partial | Individual flows cover portions of search, listings, booking, RFQ and disputes | No scenario test suite; global scenarios SC-041–SC-046 are missing |
| §21–§25 release gates, configuration, deferred scope | Missing | Existing settings screen has limited toggles | No formal release/market configuration, configuration registry or phased feature gates |
| §26.1 GM-01–GM-10 global branding and homepage | Partial | Website marketplace home and vendor entry point | No country-neutral market controls, transparent measured trust copy, market status/waitlist or SEO/activation behavior |
| §26.2 GM-11–GM-18 global dynamic categories | Missing | Basic category editor only | Dynamic unlimited taxonomy, lifecycle, localized names, scopes, suggestions and audit/versioning missing |
| §26.3 GM-19–GM-27 geography and global search | Missing | City strings and simple location filters | No geography records, coverage model, locale-aware currency conversion, market status or relevance tiers |
| §26.4 profiles | Partial | Customer/vendor profile editing and service areas | Missing field-visibility classes, locale/business fields, coverage/availability, profile completeness and protected data rules |
| §26.5 bookings and contracts | Partial | Scheduled booking request flow and RFQ acceptance | Missing instant, recurring, contract modes and contract lifecycle/versioning/milestones |
| §26.6 verification and ratings | Partial | Vendor verification status and review UI | No L0–L4 evidence matrix, dated verification labels, computed trust metrics, expiry enforcement or rating dimensions |
| §26.7 supplier/manufacturer listings | Partial | Product catalog fields, MOQ and lead time | No vendor-type/capability, price tiers, trade terms, export coverage or compliance controls |
| §26.8 dashboards | Partial | Role dashboards and sidebars | Missing market filters, contracts, subscription usage, booking calendar and independently loaded widgets |
| §26.9 payments, commission and subscriptions | Missing | Legacy status/financial fixture data only | No swappable payment provider, checkout, tokens, receipts, dual approval or commission gate |
| §26.10 responsive, i18n and accessibility | Partial | Responsive CSS and English/Hindi dictionary for limited strings | Copy is mostly hard-coded, Hindi encoding is damaged, no locale/currency selector or RTL-ready logical layout |
| §26.11 global launch market architecture | Missing | No market data model | No launch-market register, activation checklist, noindex status or dual approval |

## User-visible wording that reveals a non-production experience

| Location | Current text |
| --- | --- |
| `src/screens/auth.jsx` | `Demo — sign in as` |
| `src/screens/auth.jsx` | `Demo mode` |
| `src/screens/admin.jsx` | `No commission items in this demo for this agent.` |
| `src/data.jsx` | RFQ copy includes `Sample before bulk production.` |
| `src/data.jsx` | Sales Agent activity includes `showed app demo.` |

`demo` and `mock` also occur in internal variable names, comments and documentation. Those do not render to customers, but the final cleanup should rename route parameter metadata and remove public README wording where it describes the deployed product.

## Safe implementation sequence

1. Foundation: browser-persistent repository/service layer, authorization boundary, identity/account state, audit and i18n/locale preferences.
2. Taxonomy, geography and search: data-driven category/geography records and market-aware search.
3. Vendor onboarding/publication: computed gates, verification levels and profile visibility rules.
4. Transactions: booking/RFQ state machines, contracts and immutable terms.
5. Communications, subscriptions, trust and Super Admin operations.
6. QA: responsive review, state/error coverage, accessibility checks and scenario tests.

## Current limitations

The requested browser-only implementation can simulate persistent records and provider boundaries, but it cannot become authoritative security, payment, delivery or audit infrastructure without a backend. Service-layer authorization will prevent ordinary UI and route manipulation within this client, while a production deployment must repeat these checks on the server.

## Completed implementation work

### Phase A — foundation (in progress)

- Added `src/services/browserRepository.js` for resilient `localStorage` persistence and a small service-latency utility.
- Added `src/services/authorization.js` for role permission, vendor ownership, customer record ownership and route checks.
- Updated `src/store.jsx` to use persisted state while retaining the established context API consumed by existing screens.
- Added persisted country and currency choices alongside the existing language choice in the website header.
- Removed user-facing non-production wording identified in the audit.
- Validation: `npm.cmd run build` passes. `package.json` has no lint, type-check or test scripts.

## Change Log

| Date & time (YYYY-MM-DD HH:MM, local) | Updated by | Change | Reason |
|---|---|---|---|
| 2026-10-29 16:27 | Shil1517 | Modified: added pointer banner | Marked superseded by the new docs/ set (owner decisions D-001 to D-014) |
