# Mockup Sync Matrix (web ↔ mobile)

Maps every feature in [01-feature-spec.md](01-feature-spec.md) to the screens that implement it on web and on mobile, and says what each mockup must change to match. **This is the work list for the later mockup sync.** No mockup code was changed when this was written.

**Basis of the statuses.** Read from the two screen registries (`web/src/registry.jsx`: 88 screens, `mobile/src/registry.jsx`: 162 screens) and the earlier gap analysis. Nobody clicked through the apps, so treat a status as "what the registry and docs show", not as a test result. Screen IDs are the registry IDs.

| Status | Meaning |
|---|---|
| Done | Screen exists and shows the feature's main rules. Mockup-level only; none of the apps has a backend. |
| Partial | Screen exists but a state, rule or sub-flow is missing, or it differs from the feature spec. |
| Missing | No screen. |
| Hold | Screen exists but the feature's phase or content is undecided (phase OPEN). Do not change it until the open decision is closed. |
| Unverified | Not found in the docs or registry; check the code before syncing. |
| N/A | Nothing to show in this phase. |

**Platform scope.** Both clients carry every P1 feature (D-013). P2 features are shown on both with a "Phase 2" badge (D-010). OPEN rows stay as they are.

**Maintaining this file.** Run `python docs/tools/check_docs.py` after any edit. It fails if a registry screen is unmapped, a screen ID does not exist, or a feature ID is missing from either file. See [05-maintenance-runbook.md](05-maintenance-runbook.md).

---

## 1. Feature to screen matrix

| ID | Web screens | Web | Mobile screens | Mobile | Sync action |
|---|---|---|---|---|---|
| F-ACC-01 | `splash` `welcome` `login` `otp` `register` | Partial | `splash` `welcome` `login` `otp` `register` | Done | Web: remove the role picker and the per-role OTPs; use one login, one demo OTP and an admin second step, as mobile does. |
| F-ACC-02 | `c_profile` | Partial | `c_profile` | Done | Web: replace the role toggle / `hasVendorAccount` with the single-identity mode switch. |
| F-ACC-03 | | Missing | `acct_state` | Done | Web: add account-state screen and restricted/suspended banners. |
| F-ACC-04 | `c_settings` | Partial | `c_delete` | Done | Web: add the deletion-request flow with status. |
| F-ACC-05 | | Missing | | Missing | Both: design and add export-my-data and deletion explainer. |
| F-ACC-06 | `c_profile_edit` | Partial | `c_profile_edit` | Done | Web: add business type, locale, multiple saved locations. |
| F-ACC-07 | `c_settings` | Partial | `c_settings` | Done | Both: align channel and category preferences with F-MSG-05. |
| F-ACC-08 | | Missing | | Missing | Both: design and add session/device list for vendor and admin. |
| F-GEO-01 | `c_home` | Partial | `c_location` | Done | Web: replace the country dropdown with the country > state > city > pincode picker. |
| F-GEO-02 | | Missing | `c_location_wait` | Done | Web: add "not live" state and waitlist. |
| F-GEO-03 | | Missing | `ad_geo` | Done | Web: add geo rollout manager. |
| F-GEO-04 | | Missing | `ad_country` | Hold | None until O-04 is decided. |
| F-GEO-05 | | Missing | | Missing | None until O-05 is decided. |
| F-GEO-06 | `v_profile` | Partial | `v_areas` | Done | Web: add explicit coverage declaration (cities, states, countries, radius, remote). |
| F-GEO-07 | | Missing | | Missing | Both: show UAE / Singapore / more metros as Phase 2 rows in the rollout manager. |
| F-GEO-08 | | Partial | | Partial | Both: P1 shows INR only; tag the display-currency toggle "Phase 2". |
| F-TAX-01 | `c_categories` `c_category` | Partial | `c_categories` `c_category` | Done | Web: render from the same taxonomy data as mobile. |
| F-TAX-02 | `ad_categories` `ad_category` | Partial | `ad_categories` `ad_cat_new` `ad_taxonomy` | Done | Web: add lifecycle states, merge, retire, aliases, country scope. |
| F-TAX-03 | `ad_category` | Partial | `ad_category` | Done | Web: add per-category booking mode, response deadline, cancellation policy, RFQ schema, verification rules. |
| F-TAX-04 | | Missing | `c_cat_suggest` | Done | Web: add suggest-a-category and the admin queue. |
| F-TAX-05 | | Partial | | Done | Web: replace the 8 base + ~20 generated categories with the 10 Phase 1 industries and give them real Hindi names. |
| F-TAX-06 | | Missing | | Partial | Both: list the 9 Phase 2 industries in the taxonomy with a Phase 2 badge. |
| F-TAX-07 | | Missing | | Partial | Both: list the 11 Phase 3 industries as roadmap only. |
| F-TAX-08 | | Missing | | Done | Web: generate onboarding, listing, filter and RFQ forms from the schema. |
| F-VND-01 | `v_register` `v_business_onboard` | Partial | `v_register` `v_register_mfr` `v_register_svc` | Done | Web: add type chooser with separate service-provider and manufacturer/supplier paths. |
| F-VND-02 | | Missing | | Unverified | Both: confirm country is the first onboarding question. |
| F-VND-03 | `v_verify` | Partial | `v_verify` | Done | Both: rename "Tier 1-3" to levels L0 to L3 and show dated badges. |
| F-VND-04 | | Missing | | Partial | Both: show L4 as Phase 2. |
| F-VND-05 | | Missing | `v_listing_gate` | Done | Web: add the six-gate publication checklist. |
| F-VND-06 | `v_listings` `v_listing_edit` | Partial | `v_listings` `v_listing_edit` | Done | Web: add plan limit, pause/unpublish. |
| F-VND-07 | `ad_listings` `ad_listing` | Partial | `ad_listings` `ad_listing` | Done | Web: add duplicate flags; fold in photo, previous-work and profile-image review (RET-08, RET-09, RET-10). |
| F-VND-08 | | Missing | `v_avail` | Done | Web: add service-area and availability screens. |
| F-VND-09 | `c_vendor` `v_profile` | Partial | `c_vendor` `v_public` `v_profile` | Done | Web: add public profile with trust and verification display. |
| F-VND-10 | `v_dash` `v_more` `v_perf` | Partial | `v_dash` `v_more` `v_perf` | Done | Web: add lead usage, subscription state, credential expiry widgets and performance metrics. |
| F-VND-11 | | Missing | | Missing | None until O-09 is decided. |
| F-VND-12 | | Missing | | Missing | None until O-09 is decided. |
| F-DSC-01 | `c_home` | Partial | `c_home` | Done | Both: same home structure (search, region selectors, category explorer, sponsored label). |
| F-DSC-02 | `c_explore` | Partial | `c_explore` | Done | Web: add pagination, "why matched", pincode matching. |
| F-DSC-03 | | Missing | `c_explore_err` | Done | Web: add error/offline/no-result states. |
| F-DSC-04 | `v_explore` | Partial | `c_explore_suppliers` | Done | Web: expose supplier/manufacturer search to customers too. |
| F-DSC-05 | `c_listing` | Partial | `c_listing` `c_listing_nodata` `c_listing_trade` | Done | Web: add missing-data labels and trade-details variant. |
| F-DSC-06 | | Missing | `c_product` | Done | Web: add product page with MOQ and tiers. |
| F-DSC-07 | `c_saved` | Partial | `c_saved` | Done | Web: confirm 3-vendor compare and absent-field labels. |
| F-DSC-08 | | Missing | | Missing | None until O-09 is decided. |
| F-DSC-09 | | Missing | | N/A | None until O-09 is decided. |
| F-DSC-10 | | N/A | | N/A | Roadmap only. |
| F-BKG-01 | `c_booking_new` `c_booking` | Partial | `c_book_new` `c_booking` | Done | Both: one status vocabulary (see PRS §8.2); rename web screens to match mobile IDs at sync time. |
| F-BKG-02 | | Missing | `c_book_instant` | Done | Web: add instant booking. |
| F-BKG-03 | | Missing | | Missing | Both: design and add recurring series (linked occurrences; cancel one vs all). |
| F-BKG-04 | `c_booking` | Partial | `c_book_modify` `v_booking_mod` | Done | Web: add change request with original terms preserved. |
| F-BKG-05 | `c_booking` | Partial | `c_booking` | Done | Web: show policy before submit; record vendor cancellations. |
| F-BKG-06 | `c_booking` | Partial | `c_booking_done` | Done | Web: add 7-day confirmation. |
| F-BKG-07 | | Missing | `c_conflict` | Done | Web: add conflicting-confirmations chooser. |
| F-BKG-08 | | Missing | | Done | Web: idempotent create; hide competing requests. |
| F-BKG-09 | `v_work` | Partial | `v_work` `v_booking` `v_leads` | Done | Web: split booking requests from RFQs; add leads view. |
| F-BKG-10 | `c_activity` | Partial | `c_activity` | Done | Both: tab named "Activity"; include orders and contracts. |
| F-RFQ-01 | `c_rfq_new` | Partial | `c_rfq_new` | Done | Web: category-schema fields, scanned attachments. |
| F-RFQ-02 | `v_rfq` | Partial | `v_rfq` | Done | Web: add withdraw and validity. |
| F-RFQ-03 | `c_rfq` | Partial | `c_rfq` `c_rfq_compare` | Done | Web: add atomic accept and goods comparison. |
| F-RFQ-04 | `c_rfq` | Partial | `c_rfq_open` | Done | Web: add work order. |
| F-RFQ-05 | | Missing | `c_rfq_edit` | Done | Web: add edit with revision. |
| F-RFQ-06 | | Missing | `c_rfq_none` | Done | Web: add deadline extension and no-quotes state. |
| F-RFQ-07 | | Missing | | Missing | Both: tag as Phase 2 where RFQ forms mention currency or trade terms. |
| F-GDS-01 | `v_listing_edit` | Partial | `c_listing_trade` | Done | Web: add vendor-type, tiers, certifications, delivery regions. |
| F-GDS-02 | | Missing | `c_rfq_goods` | Done | Web: add goods RFQ. |
| F-GDS-03 | `c_order_new` `c_order` `v_orders` | Partial | `c_orders` `c_order` `v_orders` `v_order` | Done | Web: add order list and supplier-side accept/process/ship. |
| F-GDS-04 | `c_order` | Partial | `c_order_exc` | Done | Web: add delivery-exception state. |
| F-GDS-05 | | Missing | `c_order_failed` | Hold | None until O-06 is decided. |
| F-GDS-06 | | Missing | | Missing | Both: design PO dispute outcomes. |
| F-GDS-07 | | Missing | | Missing | Both: tag as Phase 2. |
| F-GDS-08 | | N/A | | N/A | Roadmap only. |
| F-GDS-09 | | N/A | | N/A | Roadmap only. |
| F-CON-01 | | Missing | `c_contract_new` `c_contract` `v_contract` | Done | Web: add propose, counter, accept screens on both sides. |
| F-CON-02 | | Missing | | Partial | Both: add milestone confirmation and contract dispute link. |
| F-CON-03 | | Missing | | Missing | Both: show renewal, amendment, termination as Phase 2. |
| F-CON-04 | | Missing | | Missing | Both: tag e-sign provider as Phase 2. |
| F-CON-05 | | Missing | | Missing | None until O-08 is decided. |
| F-BIZ-01 | | Missing | `b_eligibility` `b_register` `b_company` | Done | Web: make Business a separate account type with these screens (D-005). |
| F-BIZ-02 | | Missing | `b_home` `b_services` `b_messages` `b_more` `v_biz_network` `v_biz_profile` | Done | Web: add business workspace and vendor-side network. |
| F-BIZ-03 | | Missing | `c_companies` `c_company` `c_company_order` `b_orders` `b_order` | Hold | None until O-07 is decided. |
| F-BIZ-04 | | Missing | `ad_company` | Done | Web: add company verification queue. |
| F-BIZ-05 | `v_explore` | Partial | `vb_home` `vb_explore` `vb_rfq` `vb_compare` `vb_order` `v_buy` | Done | Web: replace the "Buy as a business" row with the full buyer journey. |
| F-BIZ-06 | | Missing | `team` | Done | Web: add team screen with Phase 2 badge. |
| F-MSG-01 | `messages` `chat` | Partial | `messages` `chat` | Done | Web: link conversations to bookings and RFQs; privacy notice; report. |
| F-MSG-02 | | Missing | | Partial | Web: add contact-share consent. |
| F-MSG-03 | | Missing | | Hold | None until O-09 is decided. |
| F-MSG-04 | `notifications` | Partial | `notifications` | Done | Web: every notification opens its record. |
| F-MSG-05 | | Missing | | Missing | Both: design channel preferences and the admin template manager (replaces web "send notification"). |
| F-SUB-01 | `v_profile` | Partial | `v_plans` `ad_plans` | Done | Both: show tier names with sample values and the "CFG-01 open" label; no prices (D-007). |
| F-SUB-02 | | Missing | `v_sub` | Done | Web: add lifecycle with grace period. |
| F-SUB-03 | | Missing | `v_checkout` `v_checkout_down` | Done | Web: add checkout and scheduled downgrade. |
| F-SUB-04 | `ad_coupons` | Hold | | Hold | None until O-02 is decided. |
| F-SUB-05 | | Missing | `v_listings` | Done | Web: add lead-usage meter. |
| F-SUB-06 | | Missing | `v_sponsor` `ad_sponsored` | Done | Web: add sponsored visibility screens. |
| F-SUB-07 | | Missing | `ad_subs` `ad_sub` | Done | Web: add monitoring and billing investigation. |
| F-SUB-08 | | Missing | `invoice` `fees` | Done | Web: add tax invoice and fees explainer. |
| F-SUB-09 | | N/A | | N/A | Roadmap only. |
| F-PAY-01 | | Missing | | Unverified | Both: show agreed price/terms as a record with the "paid directly to the vendor" notice. |
| F-PAY-02 | | Missing | | Missing | Both: design invoice / offline-terms records for contracts. |
| F-PAY-03 | | Missing | `c_pay` `c_payments` | Done | Web: add with Phase 2 badge. |
| F-PAY-04 | | Missing | `c_wallet` | Done | Web: add with Phase 2 badge. |
| F-PAY-05 | | Missing | `c_refund` `c_refund_view` `v_refunds` | Done | Web: add with Phase 2 badge. |
| F-PAY-06 | | Missing | `v_payouts` | Done | Web: add with Phase 2 badge. |
| F-PAY-07 | | Missing | `ad_commission` | Done | Web: add with Phase 2 badge. |
| F-PAY-08 | | Missing | `c_pay_fx` | Done | Web: add with Phase 2 badge. |
| F-PAY-09 | | Missing | | Missing | Both: tag as Phase 2 inside payout screens. |
| F-TRU-01 | `c_review` `v_reviews` | Partial | `c_review` `c_review_no` `c_reviews` `v_reviews` | Done | Web: add rating dimensions, not-eligible state, my reviews. |
| F-TRU-02 | | Missing | `v_public` | Done | Web: add trust score and badges. |
| F-TRU-03 | `c_issue_new` `c_issues` `c_issue` `ad_disputes` `ad_dispute` | Partial | `c_report` `c_cases` `c_case` `ad_cases` `ad_case` | Done | Both: one name, "Cases"; web adopts the mobile flow with evidence and SLA. |
| F-TRU-04 | | Missing | `v_cases` `ad_reviews` | Done | Web: add vendor appeals and the review-moderation queue. |
| F-TRU-05 | | Missing | | Done | Web: add emergency restriction with post-review inside case resolution. |
| F-TRU-06 | | Missing | | Missing | Both: tag as Phase 2. |
| F-TRU-07 | | Missing | | Missing | None until O-09 is decided. |
| F-TRU-08 | | N/A | | N/A | Roadmap only. |
| F-AGT-01 | `a_home` `a_leads` `a_lead` `a_lead_new` `a_log` `a_followups` `a_profile` | Done | `a_home` `a_leads` `a_lead` `a_lead_new` `a_log` `a_followups` `a_profile` | Done | Web: rename "Leads" to "Prospective vendors". |
| F-AGT-02 | `a_onboard` | Done | `a_onboard` | Done | None. |
| F-AGT-03 | | Missing | `a_tasks` | Done | Web: add assigned onboarding tasks. |
| F-AGT-04 | | Missing | `a_perms` | Done | Web: add permission-boundary screen. |
| F-AGT-05 | | Missing | `a_perf` | Done | Web: add conversion performance. |
| F-AGT-06 | `a_earnings` | Done | | Missing | Mobile: add earnings screen once O-03 defines the model; web keeps its screen. |
| F-AGT-07 | `ad_agents` `ad_agent` | Done | `ad_agents` `ad_agent` | Done | Mobile: add commission view to agent detail after O-03; web: fold in "shop leads" (RET-11). |
| F-AGT-08 | | N/A | | N/A | Roadmap only. |
| F-ADM-01 | `ad_dash` `ad_approvals` `ad_more` | Done | `ad_dash` `ad_approvals` `ad_more` | Done | Both: same queue list (PRS §13.1). |
| F-ADM-02 | `ad_vendors` `ad_vendor` | Done | `ad_vendors` `ad_vendor` | Done | Web: block self-approval; require reason. |
| F-ADM-03 | `ad_users` `ad_user` `ad_customers` | Done | `ad_users` `ad_user` | Done | Mobile: add customers filter. |
| F-ADM-04 | `ad_roles` | Done | `ad_roles` | Done | None. |
| F-ADM-05 | `ad_audit` | Done | `ad_audit` | Done | None. |
| F-ADM-06 | `ad_reports` `ad_analytics` | Done | `ad_analytics` | Done | Both: add supply-gap and RFQ-health panels (RET-03, RET-06); date ranges and export. |
| F-ADM-07 | `ad_settings` | Done | `ad_settings` | Done | Web: remove duplicate "platform settings" (RET-07). |
| F-ADM-08 | | Missing | `ad_cfg` | Done | Web: add open configuration register. |
| F-ADM-09 | | Missing | | Missing | None until O-05 is decided. |
| F-ADM-10 | | Missing | | Missing | Both: design maintenance / force-update screen. |
| F-ADM-11 | | Missing | | Missing | Both: tag as Phase 2. |
| F-ADM-12 | | Missing | | Missing | Both: tag as Phase 2. |
| F-ADM-13 | `ad_vendor_new` | Hold | | Missing | None until O-01 is decided. |
| F-XCT-01 | | Partial | | Partial | Web: repair damaged Hindi text; move hard-coded copy into the dictionary. |
| F-XCT-02 | | Missing | | Missing | Both: show language list and RTL as Phase 2. |
| F-XCT-03 | | Partial | `ui_states` | Done | Web: add the same loading, empty, error, offline, denied, expired states. |
| F-XCT-04 | | Partial | | Partial | Both: audit against WCAG 2.2 AA. |
| F-XCT-05 | | Partial | | Partial | Both: same terminology and status vocabulary; this matrix is the check. |
| F-XCT-06 | | Missing | `c_dash` | Done | Web: add customer dashboard. |
| F-XCT-07 | | N/A | | N/A | Roadmap only. |
| F-MCK-01 | `scope_review` | Done | `vision` `flows` `journeys` `journeys_pick` | Done | Both: same five required demo journeys and a phase view generated from these docs. |

## 2. Web screens to retire or fold in

Applied under decision D-009 ("drop web-only admin screens that are not in the PRS"). The screen leaves the web navigation and its useful content moves into the feature named. Nothing is deleted from the code until the sync pass.

| ID | Web screen | Disposition | Folds into | Reason |
|---|---|---|---|---|
| RET-01 | `ad_faqs` | Retire | F-ADM-07 | FAQs management is not in the PRS. |
| RET-02 | `ad_requirements` | Retire | F-ADM-06 | Admin browsing of customer requirements is not in the PRS; aggregate demand lives in analytics. |
| RET-03 | `ad_supply_gaps` | Fold in | F-ADM-06 | PRS §18 asks for service-coverage gaps as a metric, not a console. |
| RET-04 | `ad_quote_moderation` | Fold in | F-TRU-04 | Quote content problems are handled as reports and cases (PRS §12.2). |
| RET-05 | `ad_category_templates` | Fold in | F-TAX-03 | Category templates are the per-category RFQ schema (PRS §6.2). |
| RET-06 | `ad_rfq_health` | Fold in | F-ADM-06 | RFQ metrics are in PRS §18. |
| RET-07 | `ad_platform_settings` | Retire | F-ADM-07 | Duplicate of `ad_settings`. |
| RET-08 | `ad_photo_approvals` | Fold in | F-VND-07 | Photos are part of listing review (PRS §12.2). |
| RET-09 | `ad_previous` | Fold in | F-VND-07 | Portfolio is vendor content reviewed with the listing (PRS §26.4.2). |
| RET-10 | `ad_profile_images` | Fold in | F-VND-07 | Logo and banner are reviewed with the vendor profile. |
| RET-11 | `ad_shop_leads` | Fold in | F-AGT-07 | All-leads oversight is part of sales oversight (PRS §4.2). |
| RET-12 | `ad_notifications` | Replace | F-MSG-05 | Manual broadcast is not in the PRS; the PRS needs templates and preferences instead (CFG-10). |

## 3. Differences that are not features

These are mockup behaviours that differ between the apps and must be made the same at sync time.

| Topic | Web today | Mobile today | Target |
|---|---|---|---|
| Demo credentials | A different OTP per role | One OTP (123456), admin MFA 654321 | Mobile's scheme on both. |
| Admin in role picker | Visible | Hidden (`HIDE_ADMIN`) | Open: decide with the mockup sync (see O-11). |
| Persistence | `localStorage` | In memory | Either, but both reset the same way from a "reset demo data" action. |
| Screen counts in READMEs | n/a | Says 93 and 111 | Generated from the registry. |
| Verification wording | n/a | "Tier 1 to 4" | "Level L0 to L4" everywhere. |
| Support wording | Issues / Disputes | Cases | "Cases". |

## Change Log

| Date & time (YYYY-MM-DD HH:MM, local) | Updated by | Change | Reason |
|---|---|---|---|
| 2026-10-29 16:27 | Shil1517 | Added: sync matrix for all features; 12 retired/folded web screens | Needed a per-feature work list so web and mobile mockups can be synced to one spec. Retirements follow D-009. |
