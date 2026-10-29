# 09 · Estimated Development Timeline

> **Detail document, not yet reviewed against the 2026-10-29 decisions** (see [../../../docs/04-decisions-log.md](../../../docs/04-decisions-log.md)). Phase labels follow the spec in [../../../docs/01-feature-spec.md](../../../docs/01-feature-spec.md) where they differ.


**Treat as a planning estimate (±25%), not a quote.** It assumes the scope in doc 08, decisions in §5 of doc 08 made in week 0–2, and the staffing below. The mockup already provides validated UI structure, business rules and sample data, which shortens design and discovery.

## 1. Assumed team

| Role | Count |
|---|---|
| Product manager / BA | 1 |
| UI/UX designer | 1 |
| Backend engineers | 3 |
| Mobile engineers (React Native) | 2 |
| QA (manual + automation) | 2 |
| DevOps / SRE | 1 (part-time → full-time at hardening) |
| Tech lead / architect | 1 |

Fewer engineers stretch the timeline roughly in proportion on the build phases.

## 2. MVP plan — about 30 weeks

| Phase | Weeks | Work | Exit |
|---|---|---|---|
| **0 · Discovery & setup** | 1–3 | Resolve doc 08 decisions · API contracts (OpenAPI) · design system from mockup · CI/CD, environments, observability · provider selection (SMS, KYC, billing) | Signed-off scope, running skeleton |
| **1 · Foundation** | 4–7 | Auth/OTP/MFA · accounts and modes · RBAC · geo · taxonomy engine · files · audit · notifications core | Login, location, categories work end to end |
| **2 · Vendor supply** | 8–12 | Vendor onboarding (4 types) · verification and reviewer queue · listings and catalogue · 6-gate publication · service areas, availability | Vendor can register, be verified, publish |
| **3 · Discovery** | 10–14 *(overlaps)* | Search service and index · ranking · filters · compare/favourites · vendor profile | Customer finds live listings |
| **4 · Transactions** | 13–20 | Bookings (instant + scheduled) · RFQ and quotes with atomic accept · goods RFQ and PO · contracts (core) · chat | J1, J2, J3 pass |
| **5 · Revenue & trust** | 19–24 | Plans, billing, webhooks, grace · sponsored · invoices · reviews · reports/cases/appeals · business accounts · buyer mode | Vendors can pay; trust loop works |
| **6 · Admin & agents** | 21–25 *(overlaps)* | Admin queues, analytics, config register, geo rollout · agent CRM and assisted onboarding | J4, J5, J6, J7 pass |
| **7 · Hardening** | 26–28 | Performance and load · security review and pen test · accessibility audit · localisation (EN/HI) · data migration/seed · bug bash | Release candidate |
| **8 · UAT & launch** | 29–30 | Client UAT · store submission (Play / App Store review) · soft launch in Jaipur · monitoring | Go-live |

Critical path: auth → taxonomy → vendor/listing → search → booking/RFQ → billing → hardening.

## 3. Phase 2 plan — about 18–20 weeks after MVP

| Stream | Weeks | Work |
|---|---|---|
| Payments & escrow | 1–10 | Payment provider, escrow hold/release, milestones, wallet, refunds, reconciliation |
| Commission & payouts | 6–14 | Rule engine, payouts, bank verification, tax handling |
| Global trade | 4–14 | Incoterms, multi-currency, samples, trade-doc vault |
| Languages & RTL | 2–8 | Arabic RTL, ES/FR/DE/ZH, translation workflow |
| Verification tier 4 + KYB | 8–14 | Audit scheduling, registry integrations |
| Teams, contracts v2 | 10–16 | Business roles, approvals, renewal/amend/terminate, e-sign |
| New industries & cities | continuous | Taxonomy only — no release required |
| Hardening & launch | 17–20 | Payments security review, compliance, UAT |

## 4. Effort summary

| Scope | Calendar | Approx. person-weeks |
|---|---|---|
| MVP | ~30 weeks | ~240 |
| Phase 2 | ~18–20 weeks | ~150 |

## 5. Milestones

| Milestone | Target |
|---|---|
| M0 Scope & contracts frozen | Week 3 |
| M1 Foundation demo | Week 7 |
| M2 Vendor can publish | Week 12 |
| M3 First booking end to end | Week 18 |
| M4 Feature complete | Week 25 |
| M5 Release candidate | Week 28 |
| M6 Go-live (Jaipur) | Week 30 |

## 6. Risks to the timeline

| Risk | Effect | Mitigation |
|---|---|---|
| Config register (CFG-01…12) unresolved | Billing and policies stall | Business sign-off by week 3 |
| KYC/KYB integration delays | Verification blocked | Manual document review fallback |
| Web workstream (separate developer) changes shared API needs | Rework on backend contracts | Freeze OpenAPI contract by M0; change control for both clients |
| App-store review rejections | +1–2 weeks | Early TestFlight/Play internal track from week 14 |
| SMS DLT registration in India | OTP blocked | Start registration in week 1 |
| Search relevance tuning | Quality slips | Seed real listings early; weekly relevance review |
| Scope creep from Phase 2 screens already in mockup | MVP slips | Feature flags; change control |

## Change Log

| Date & time (YYYY-MM-DD HH:MM, local) | Updated by | Change | Reason |
|---|---|---|---|
| 2026-10-29 16:27 | Shil1517 | Modified: added pointer banner | Added pointer to the new docs/ set; content review still outstanding |
