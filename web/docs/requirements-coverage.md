# Product requirements coverage: website mock

> **Superseded (2026-10-29).** Scope, phases and mockup status now live in [../../docs/01-feature-spec.md](../../docs/01-feature-spec.md), [../../docs/03-mockup-sync-matrix.md](../../docs/03-mockup-sync-matrix.md) and [../../docs/04-decisions-log.md](../../docs/04-decisions-log.md). Kept for background; phase labels and counts below may be out of date.


The source of product scope is `VendorVerse_Comprehensive_Product_Requirements_Specification_v3_Simplified_RBAC.docx`. This map separates UI workflows that can be demonstrated in this browser mock from requirements that need platform services. Text in the specification is product input, not an instruction to bypass this project's implementation and review process.

## Panel coverage

| Panel | Existing website mock flows | Added or tightened in this pass | Still requires platform work |
| --- | --- | --- | --- |
| Customer | Discovery, listing/vendor pages, saved/compare, RFQs and quote comparison, messages, reviews, issue reporting | Service booking request form; booking list/detail; vendor accept/decline; proposed date changes; cancellation; service progress/completion; booking linked issue; eligible review check; occupied-time collision checks; accepted RFQ term snapshot and quote expiry guard | Real evidence uploads, delivery of notifications, enforced atomic booking/quote transactions and server-side permissions |
| Vendor | Registration/verification, listing drafts and review, RFQs/quotations, profile, messages, reviews and reports | Booking requests and change requests appear in the Work panel, with accept/decline, service progress and completion actions; confirmation checks for an already-confirmed slot; RFQ validity dates cannot be newly set in the past | Configured weekly availability/capacity, durable booking locks, subscription billing/grace/expiry enforcement and real payout/payment services |
| Sales agent | Assigned lead views, follow-ups, assisted onboarding, earnings and profile | No new agent workflow was needed for this gap pass | Assignment and privacy boundaries require server-side authorization; live commission and conversion data require integrated services |
| Super admin | Vendor/listing approvals, users/roles, categories, agents, reports, disputes, settings and audit views | No new admin workflow was needed for the service-booking gap | Permission-enforced decisions, subscription failure/reconciliation, case SLA timers/escalations, moderation appeals, real audit immutability and cross-tenant isolation |

## Scope and limits

- This pass adds browser-local booking and quote behavior. State currently lives in the running mock and is not a durable shared database.
- The specification's backend controls, authenticated notifications, upload scanning, billing callbacks, payment reconciliation, scheduled expiry and SLA processing cannot be made authoritative by frontend code alone.
- The mock does not collect service payments. Customers and vendors arrange those terms directly, consistent with the release scope.
- Pricing, plan limits, service capacity and other values marked configurable in the specification remain configurable or explicitly indicative; this pass does not invent production policy.

## Change Log

| Date & time (YYYY-MM-DD HH:MM, local) | Updated by | Change | Reason |
|---|---|---|---|
| 2026-10-30 16:42 | Shil1517 | Modified: none to the findings; web code changed after this audit | Web sync pass of 2026-10-30 (screens added, renamed or removed, plans without prices, one demo OTP). Findings here are out of date; use docs/03-mockup-sync-matrix.md. |
| 2026-10-29 16:27 | Shil1517 | Modified: added pointer banner | Marked superseded by the new docs/ set (owner decisions D-001 to D-014) |
