# 01 · Updated Feature Coverage & Gap Analysis

> **Superseded (2026-10-29).** Scope, phases and mockup status now live in [../../../docs/01-feature-spec.md](../../../docs/01-feature-spec.md), [../../../docs/03-mockup-sync-matrix.md](../../../docs/03-mockup-sync-matrix.md) and [../../../docs/04-decisions-log.md](../../../docs/04-decisions-log.md). Kept for background; phase labels and counts below may be out of date.


_Baseline: mobile mockup (156 screens in `docs/screen-inventory.csv`), spec of 19 Oct 2026. Updated 28 Oct 2026._

**Scope: mobile only (Android + iOS).** Web is being handled separately by another developer and is not covered in these documents.

**How to read "covered".** The mockup has no backend. "Covered" means the screen is clickable and the business rule is evaluated in the browser. It does **not** mean production-ready. Every row below still needs real APIs, persistence and integrations.

## 1. Summary

| Measure | Count |
|---|---|
| Mobile mockup screens | 156 (146 MVP-tagged, 10 Phase 2) |
| Roles modelled | Customer, Vendor, Business (company), Sales agent, Admin |
| Demo journeys clickable end to end | 7 (J1–J7) |
| Industries in taxonomy | 30 (10 MVP, 9 Phase 2, 11 Phase 3 — see doc 03) |

## 2. Coverage by feature area

Legend: ✅ covered in mockup · 🟡 partial · ❌ missing · 🔮 future (Phase 3)

| # | Feature area | Mockup | Notes |
|---|---|---|---|
| 1 | Brand, region-aware home, intent tabs | ✅ | EN + HI only. |
| 2 | Dynamic categories + suggest-a-category + taxonomy builder | ✅ | Per-category custom fields drive onboarding, listing, RFQ, filters. |
| 3 | Country → state → city → pincode, waitlist, rollout matrix | ✅ | 4 live cities; country packs exist. |
| 4 | Customer profile (individual/business), vendor public profile | ✅ | Business-team roles are Phase 2. |
| 5 | Business (company) account, vendor-gated | ✅ | Owner-only, 3+ yrs, admin verified, vendors message only. |
| 6 | Scheduled booking | ✅ | Full state machine incl. modify/cancel/conflict. |
| 7 | Instant booking | ✅ | Live availability, atomic slot check. |
| 8 | Structured RFQ (services) | ✅ | Revisions, atomic accept, locked terms. |
| 9 | Goods catalogue + goods RFQ + purchase order | ✅ | MOQ, tiers, PO lifecycle with exception/failed states. |
| 10 | Contract booking (recurring, AMC, supply, milestones) | 🟡 | Propose/counter/sign modelled; no renewal, amendment or termination flows. |
| 11 | Vendor-to-vendor procurement (buyer mode) | ✅ | |
| 12 | Verification tiers 1–3, expiry, reviewer queue | ✅ | Tier 4 audit is Phase 2. |
| 13 | Publication gates (6) | ✅ | Computed, not stored. |
| 14 | Reviews (verified only), reports, cases, appeals | ✅ | |
| 15 | Chat (linked, privacy-aware) | 🟡 | Text only. No attachments policy, read receipts, or real-time behaviour defined. |
| 16 | Subscriptions, grace, sponsored visibility | ✅ | Plan values are sample (CFG-01/02). |
| 17 | Checkout, escrow, wallet, refunds, payouts, commission | 🟡 | Screens exist (Phase 2). Contradicts MVP direct-payment model — keep hidden in MVP. |
| 18 | Sales-agent CRM (leads, consent onboarding, tasks) | ✅ | No agent commission (by design). |
| 19 | Admin: queues, RBAC, audit, analytics, config register | ✅ | Analytics are static samples. |
| 20 | Notifications | 🟡 | Inbox + destinations only. No channel/template/preference model for push, SMS, email, WhatsApp. |
| 21 | Multi-language | 🟡 | EN/HI. RTL + 5 languages Phase 2. |
| 22 | Accessibility WCAG 2.2 AA | 🟡 | Target stated; not audited. |

## 3. Gap list

| ID | Gap | Impact | Proposed handling |
|---|---|---|---|
| G1 | _Withdrawn — web is out of scope for this plan (separate workstream)._ | — | The API (doc 07) is client-agnostic, so the web developer can consume the same backend. |
| G2 | README/vision screens quote stale counts (93/111 screens). | Low | Regenerate from inventory. |
| G3 | No backend, auth, persistence, file storage, search engine. | Foundational | Doc 06, 07, 09. |
| G4 | Payments conflict: MVP is direct pay, but P2 checkout/escrow screens are in the same build. | Medium — scope confusion | Feature-flag; exclude from MVP navigation. |
| G5 | Notification system not specified (channels, templates, quiet hours, opt-in/out, DLT for SMS in India). | Medium | Add module N1 in doc 07; spec in MVP. |
| G6 | Tax/invoicing: GST invoice screen exists; no rules for TCS/TDS, e-invoice, place of supply. | Medium (India legal) | Needs finance/legal input. |
| G7 | Dispute path for purchase orders (damaged goods, partial delivery) exists as screen only; no settlement outcomes. | Medium | Define outcomes: replace, credit note, partial refund, close. |
| G8 | Contract lifecycle lacks renewal, amendment, termination, missed-milestone handling. | Medium | Add states to doc 05. |
| G9 | Search: ranking rules are mocked client-side. Needs geo index, filters, pagination at scale. | High | Search service (doc 07 module S1). |
| G10 | KYC/KYB provider integrations (GST, PAN, Aadhaar-consented, MCA) not selected. | High | Vendor selection in Phase 0. |
| G11 | Support/helpdesk tooling for staff (macros, SLA timers, queue assignment) beyond case screens. | Low–Med | Use off-the-shelf helpdesk or build minimal. |
| G12 | Content moderation for listing images/text (automated pre-screen). | Medium | Third-party moderation API. |
| G13 | Data lifecycle: retention, export, deletion cascade (DPDP Act alignment). | High (legal) | Policy + jobs; doc 06 notes soft-delete + anonymisation. |
| G14 | Agent: field/offline tools. | Low | Phase 3. |
| G15 | Open configuration register (CFG-01…12) still has unresolved values (plan prices, response deadlines, cancellation windows). | High | Business sign-off before build of billing. |
| G16 | Analytics events/tracking plan not defined. | Medium | Define event taxonomy in Phase 0. |
| G17 | Observability, rate limiting, abuse prevention (OTP pumping, scraping of contacts). | High | Non-functional list in doc 09/10. |

## 4. Scope conflicts to resolve with the client

1. **Payments**: confirm MVP = vendors paid directly; platform revenue only from subscriptions + sponsorship.
2. **Shared backend with the web workstream**: agree the API contract (doc 07) with the web developer so both clients use one backend.
3. **Manufacturing industry** (`i_manu`) is tagged Phase 2 while the supplier/manufacturer onboarding path is MVP. Recommendation: allow manufacturers in the `Wholesale` industry at MVP; open `Manufacturing & OEM` in Phase 2.
4. **Agent commissions**: mockup shows conversion metrics only. Confirm agents are paid outside the platform.

## Change Log

| Date & time (YYYY-MM-DD HH:MM, local) | Updated by | Change | Reason |
|---|---|---|---|
| 2026-10-29 16:27 | Shil1517 | Modified: added pointer banner | Marked superseded by the new docs/ set (owner decisions D-001 to D-014) |
