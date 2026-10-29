# VendorVerse — user flows & roadmap (review pack)

> **Detail document, not yet reviewed against the 2026-10-29 decisions** (see [../../docs/04-decisions-log.md](../../docs/04-decisions-log.md)). Phase labels follow the spec in [../../docs/01-feature-spec.md](../../docs/01-feature-spec.md) where they differ.


Generated from the interactive mockup.

## User flows

### F1 · Discover → book a service  `MVP`
_Customer ↔ Vendor_

1. Home → Home (`c_home`)
2. Search & filter → Search, filters & ranking (`c_explore`)
3. Listing → Listing detail (`c_listing`)
4. Request booking → Request a booking (`c_book_new`)
5. Booking tracker → Booking detail & timeline (`c_booking`)
6. Vendor accepts → Booking request & actions (`v_booking`)
7. Confirm & review → Rate a vendor (eligible only) (`c_review`)

### F2 · Instant booking  `MVP`
_Customer_

1. Listing ⚡ → Listing detail (`c_listing`)
2. Choose “Book now” → Request a booking (`c_book_new`)
3. Confirmed with ETA → Booking detail & timeline (`c_booking`)

### F3 · RFQ → compare → accept  `MVP`
_Customer ↔ Vendor_

1. Create RFQ → Create RFQ (`c_rfq_new`)
2. Vendor quotes → Submit / revise quotation (`v_rfq`)
3. Compare quotes → RFQ, quotes & atomic accept (`c_rfq`)
4. Atomic accept → RFQ — accepted terms snapshot (`c_rfq_open`)
5. Work order / contract → Contract — terms, e-sign, milestones (`c_contract`)

### F4 · Contract booking  `Phase 2`
_Customer ↔ Vendor_

1. Propose contract → Propose a contract (`c_contract_new`)
2. Vendor counters → Contract — respond, counter, sign (`v_contract`)
3. E-sign & activate → Contract — terms, e-sign, milestones (`c_contract`)
4. Milestone / visit paid → Checkout & escrow (`c_pay`)

### F5 · Global sourcing  `MVP`
_Buyer ↔ Manufacturer_

1. Filter suppliers → Search, filters & ranking (`c_explore`)
2. Trade details & tiers → Supplier listing — trade details (`c_listing_trade`)
3. Global RFQ (incoterms, currency) → Create RFQ (`c_rfq_new`)
4. Compare quotes → RFQ, quotes & atomic accept (`c_rfq`)
5. Samples / contract → Propose a contract (`c_contract_new`)

### F6 · Vendor onboarding → publish  `MVP`
_Vendor ↔ Admin_

1. Onboard → Onboarding wizard (`v_register`)
2. Verification tiers → Verification status (`v_verify`)
3. Reviewer decision → Review vendor evidence (`ad_vendor`)
4. Subscribe → Subscription & billing events (`v_sub`)
5. Create listing → Add / edit listing (`v_listing_edit`)
6. Listing review → Review listing & duplicates (`ad_listing`)
7. Publication checklist → Publication checklist (6 gates) (`v_listing_gate`)

### F7 · Suggest a category  `MVP`
_Anyone ↔ Admin_

1. Browse all → All industries & categories (`c_categories`)
2. Suggest → Suggest a category (`c_cat_suggest`)
3. Admin builder → Taxonomy builder (`ad_taxonomy`)
4. Category goes live → Category detail (`c_category`)

### F8 · Launch a new city  `MVP`
_Customer ↔ Admin_

1. Pick city → Country · state · city picker (`c_location`)
2. Join waitlist → Country · state · city picker (`c_location`)
3. Rollout matrix → Geo rollout manager (`ad_geo`)
4. Go live → Home (`c_home`)

### F9 · Pay, escrow & payout  `Phase 2`
_Customer → Vendor → Platform_

1. Checkout → Checkout & escrow (`c_pay`)
2. Held in escrow → Payments, methods & invoices (`c_payments`)
3. Release on completion → Booking detail & timeline (`c_booking`)
4. Vendor payout → Earnings, payouts & commission (`v_payouts`)
5. Commission rules → Revenue & commission (`ad_commission`)

### F10 · Report → resolve → appeal  `MVP`
_Anyone ↔ Admin ↔ Vendor_

1. Report → Report / raise an issue (`c_report`)
2. Case triage → Resolve case (`ad_case`)
3. Decision → Trust & support cases (`ad_cases`)
4. Appeal → Moderation & appeals (`v_cases`)
5. Human re-review → Review moderation & appeals (`ad_reviews`)

## MVP vs Phase 2 vs Phase 3

### 1 · Branding & homepage
- **MVP** — Global brand, region-aware homepage, intent tabs (hire / source / contract)
- **MVP** — Multi-language UI: English + Hindi
- **Phase 2** — Arabic, Spanish, French, German, Chinese + RTL
- **Phase 3** — Personalised homepage & AI search

### 2 · Dynamic unlimited categories
- **MVP** — Admin taxonomy builder: industry → category → subcategory → attributes
- **MVP** — Vendor / customer “suggest a category” with admin approval
- **MVP** — 10 priority categories live; 30 industries browsable
- **Phase 2** — Per-country category packs & localized attribute schemas
- **Phase 3** — ML-assisted category mapping from free text

### 3 · Country, state & city search
- **MVP** — Country → state → city → pincode picker with launch status
- **MVP** — Live cities: Jaipur, Ajmer, Sikar, Delhi NCR; waitlist elsewhere
- **MVP** — Service-coverage scopes: city, state, country, global
- **Phase 2** — More Indian metros + UAE / Singapore
- **Phase 3** — UK, US, EU, APAC launch with local compliance

### 4 · Customer & vendor profiles
- **MVP** — Customer: individual / business account, addresses, completeness meter
- **MVP** — Vendor public profile: company, certifications, capabilities, gallery, catalogue
- **Phase 2** — Multi-user vendor teams & roles
- **Phase 3** — Enterprise customer accounts, approval chains, cost centres

### 5 · Instant, scheduled, RFQ & contract bookings
- **MVP** — Scheduled booking (request → accept)
- **MVP** — Structured RFQ with revisions & locked accepted terms
- **MVP** — Instant booking in select categories with live availability
- **Phase 2** — Contract bookings: recurring, supply, AMC, milestones, e-sign
- **Phase 3** — Multi-vendor project plans & tenders

### 6 · Verification & ratings
- **MVP** — Tier 1–3 verification, expiry tracking, reviewer queue
- **MVP** — Verified-transaction reviews with 4 rating dimensions + trust score
- **Phase 2** — Tier 4 audited partner (site audit, ISO, references)
- **Phase 2** — Third-party KYB / registry integrations per country
- **Phase 3** — Fraud-signal ML & continuous monitoring

### 7 · Global suppliers & manufacturers
- **MVP** — Supplier / manufacturer listings: MOQ, volume tiers, lead time, certifications
- **MVP** — Domestic RFQ for goods
- **Phase 2** — Cross-border: incoterms, export markets, multi-currency quotes
- **Phase 2** — Samples workflow, customs & trade-document vault
- **Phase 3** — Trade finance, inspection & freight bundles

### 8 · Dashboards
- **MVP** — Customer, vendor and admin dashboards (operational)
- **MVP** — Geo rollout manager & category-by-city launch matrix
- **MVP** — Revenue dashboard: subscriptions & sponsorship
- **Phase 2** — Commission & payout analytics, cohort / funnel analytics
- **Phase 3** — Predictive demand & pricing benchmarks

### 9 · Payments, commission & subscriptions
- **MVP** — Vendor subscription plans, renewal, grace, sponsored visibility
- **MVP** — Customers pay vendors directly (no platform-held funds)
- **Phase 2** — In-app checkout, escrow & milestone release, wallet, invoices
- **Phase 2** — Commission engine by category & country, vendor payouts, tax handling
- **Phase 3** — Multi-currency settlement, trade finance, BNPL

### 10 · Responsive web & mobile
- **MVP** — Android, iOS and responsive web with identical business rules
- **MVP** — Accessibility target WCAG 2.2 AA
- **Phase 3** — Offline field tools for vendors & agents

## Screen counts

- MVP: 108
- P2: 12
- Total: 120

## Demonstration journeys (priority review)

All seven are clickable end to end from the in-app “Demonstration journeys” screen (guided Next/Prev bar). Data is sample content.

### J1 · Customer books a local service  _(Customer)_
1. Search & filter near you — `c_explore`
2. Open provider profile — `c_vendor`
3. Choose service & time → confirm — `c_book_new`
4. Booking status — `c_booking`

### J2 · Business requests bulk manufacturer quotations  _(Business buyer)_
1. Search manufacturers / products — `c_explore_suppliers`
2. Product with MOQ & tiers — `c_product`
3. Submit RFQ (qty, specs, delivery) — `c_rfq_goods`
4. Compare quotations & negotiate — `c_rfq_compare`
5. Accept → purchase order — `c_order`

### J3 · Vendor registers and manages products / services  _(Vendor)_
1. Choose vendor type & register — `v_register`
2. Submit verification evidence — `v_verify`
3. Admin decision — `ad_vendor`
4. Add products / services — `v_listing_edit`
5. Manage leads & quotations — `v_leads`

### J4 · Admin creates a category and approves a vendor  _(Admin)_
1. Create category — `ad_cat_new`
2. Configure fields, filters, documents — `ad_category`
3. Publish & verify it appears — `ad_taxonomy`
4. Review vendor evidence — `ad_vendors`
5. Approve / reject with reason — `ad_vendor`

### J5 · Vendor-to-vendor procurement  _(Vendor as buyer)_
1. Switch to buyer mode — `vb_home`
2. Find a supplier — `vb_explore`
3. Send bulk RFQ — `vb_rfq`
4. Compare & accept quotes — `vb_compare`
5. Track purchase order — `vb_order`

### J6 · Company owner opens a Business account  _(Business owner)_
1. Eligibility: owner, 3+ years, registered — `b_eligibility`
2. Company-level form (6 steps) — `b_register`
3. Admin verifies the company — `ad_company`
4. Company live — services for vendors — `b_services`

### J7 · Vendor connects with a Business by message  _(Vendor)_
1. Open the Business network — `v_biz_network`
2. View a verified company profile — `v_biz_profile`
3. Message the company (the only way in) — `chat`

## Acceptance checklist

- [x] Global search is not limited to nearby providers; service coverage is visible (`c_explore`, `c_listing_trade`)
- [x] At least one service-provider and one manufacturer/supplier onboarding path (`v_register`, `v_register_mfr`)
- [x] Booking, scheduled service, RFQ and supplier-order flows are distinguishable (`journeys_pick`, `c_book_instant`, `c_rfq_new`, `c_order`)
- [x] Quotation comparison and acceptance lead to the correct next record (booking, order or contract) (`c_rfq_compare`, `c_rfq_open`)
- [x] Admin can configure a category and its custom fields without category-specific hardcoding (`ad_cat_new`, `ad_category`)
- [x] Vendor verification shows evidence-based pending, approval and rejection outcomes (`v_verify`, `ad_vendor`)
- [x] All demonstration journeys can be completed in the clickable prototype (`journeys`)
- [x] Business accounts are separate from vendors: owner-only sign-up, vendors connect by message only, no vendor switch (`b_eligibility`, `v_biz_network`, `v_biz_profile`)
- [x] Core navigation, notification destinations, empty / error / loading and cancellation states (`notifications`, `ui_states`)
- [x] Demo data and not-yet-available features are clearly labelled (`vision`)
- [x] MVP vs Phase 2 vs Future scope is shown before estimates are finalised (`vision`, `flows`)

## Change Log

| Date & time (YYYY-MM-DD HH:MM, local) | Updated by | Change | Reason |
|---|---|---|---|
| 2026-10-29 16:27 | Shil1517 | Modified: added pointer banner | Added pointer to the new docs/ set; content review still outstanding |
