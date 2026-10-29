# 08 · MVP and Phase 2 Scope

**Business model fixed for MVP:** customers pay vendors directly. Platform revenue = vendor subscriptions + sponsored visibility. The platform holds no customer funds.

## 1. MVP (Release 1)

### In scope

| Area | MVP includes |
|---|---|
| Platforms | **Android and iOS only.** Web is a separate workstream and uses the same backend API |
| Accounts | Phone/email + OTP, one identity with customer / vendor / business modes, account states, deletion request |
| Languages | English, Hindi |
| Geography | Country → state → city → pincode picker; live: Jaipur, Ajmer, Sikar, Delhi NCR; waitlist elsewhere |
| Taxonomy | Admin taxonomy builder, category schemas, suggest-a-category; **10 industries live** (launch categories: Home, Construction, Events, Professional, Wholesale) |
| Vendors | Service provider, contractor, manufacturer, supplier onboarding; verification tiers 1–3 with expiry; 6-gate publication; public profile |
| Business accounts | Owner-only company profile, admin verification, vendor→company messaging only |
| Customer buying | Search/filter/rank, compare 3, favourites, vendor and listing detail |
| Booking modes | Instant, scheduled, structured RFQ (atomic accept, locked terms), goods RFQ → purchase order, basic contract (propose / counter / e-sign / milestones) |
| Goods | Catalogue with MOQ and volume tiers, domestic RFQ, PO lifecycle |
| Vendor-to-vendor | Buyer mode (RFQ + PO) |
| Messaging | Linked, privacy-aware chat; contact-share consent |
| Trust | Eligible-only reviews with 4 ratings, trust score, reports, cases with SLA, appeals with human re-review |
| Revenue | Plans, entitlements, checkout (tax, coupon, proration), grace period, sponsored visibility, tax invoice |
| Sales agents | Leads, consent-based assisted onboarding, tasks, conversion metrics |
| Admin | Queues, RBAC with separation of duties, MFA, audit log, analytics, geo rollout, country packs, config register |
| Notifications | Push, SMS, email, in-app; user preferences (new — gap G5) |
| Compliance | WCAG 2.2 AA target, DPDP-aligned consent/deletion/export |

### MVP additions required (from gap analysis)

Notification preferences and template manager · PO dispute outcomes · data export / deletion explainer · moderation review queue · session/device list for vendors and admins · maintenance/force-update screen · analytics date ranges and export.

### Out of MVP (hidden by feature flag)

Checkout/escrow, wallet, refunds, payouts, commission engine, FX checkout, business team roles, cross-border trade.

## 2. Phase 2

| Pillar | Phase 2 scope |
|---|---|
| Payments | In-app checkout, escrow with milestone release, wallet, refunds, invoices, bank verification |
| Commission | Engine by category and country, vendor payouts, tax handling (TCS/TDS), commission analytics |
| Languages | Arabic (RTL), Spanish, French, German, Chinese |
| Geography | More Indian metros; UAE, Singapore |
| Categories | Per-country packs; localised attribute schemas; 9 Phase 2 industries opened (Manufacturing & OEM, Textiles, Chemicals, Food processing, Education providers, Finance/RE, Marketing/media, Power/utilities, Packaging/printing) |
| Verification | Tier 4 audited partner; third-party KYB / registry integrations per country |
| Global trade | Incoterms, export markets, multi-currency quotes, samples workflow, trade-document vault, customs |
| Contracts | Renewal, amendment, termination, e-sign provider integration |
| Teams | Business team roles, spending limits, approvals; vendor staff accounts |
| Analytics | Cohort and funnel analytics, commission/payout analytics, event tracking console |
| Ops | Helpdesk macros and SLA timers, feature-flag console |

## 3. Phase 3 (direction only)

Personalised home and AI search · ML category mapping · fraud-signal ML and continuous monitoring · UK/US/EU/APAC launches with local compliance · enterprise accounts (approval chains, cost centres) · multi-vendor project plans and tenders · trade finance, BNPL, inspection and freight bundles · predictive demand and pricing benchmarks · offline field tools · remaining 11 industries.

## 4. MVP exit criteria

1. All journeys J1–J7 run end to end against the real backend.
2. A vendor can onboard, be verified, subscribe, publish and receive a booking without engineer help.
3. An admin can add a new category, publish it and see it in search with no release.
4. No P1/P2 defects open; security review and load test passed (doc 10).
5. Configuration register CFG-01…12 fully resolved.

## 5. Decisions needed before build starts

| # | Decision | Owner |
|---|---|---|
| 1 | Mobile stack: React Native vs Flutter vs native (mockup is React; RN reuses most UI logic) | Tech lead |
| 2 | API contract shared with the web developer (one backend, two clients) | Tech lead |
| 3 | KYC/KYB vendor | Product + Legal |
| 4 | Subscription billing provider | Finance |
| 5 | Plan prices and limits (CFG-01/02), response deadlines, cancellation windows | Business |
| 6 | Hosting region and cloud provider | Tech lead |
| 7 | Whether manufacturers launch under Wholesale at MVP | Product |
