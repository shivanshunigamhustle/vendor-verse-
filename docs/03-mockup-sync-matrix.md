# Mockup Sync Matrix (web ↔ mobile)

Maps every feature in [01-feature-spec.md](01-feature-spec.md) to the screens that implement it on web and on mobile, and says what each mockup must change to match. **The mockup sync of 2026-10-29 17:21 has been applied: web now renders the same screens as mobile for every non-admin feature, so most rows read Done on both. The rows that still say Partial, Missing, Hold or Unverified are real gaps that exist on both apps.

**Basis of the statuses.** Read from the two screen registries (`web/src/registry.jsx`: 166 screens, `mobile/src/registry.jsx`: 132 screens; the difference is the 34 admin-portal screens that exist on web only) plus a render check of every registered screen and a build of both apps. Nobody clicked through every flow, so treat a status as "what the registry and docs show", not as a test result. Screen IDs are the registry IDs.

| Status | Meaning |
|---|---|
| Done | Screen exists and shows the feature's main rules. Mockup-level only; none of the apps has a backend. |
| Partial | Screen exists but a state, rule or sub-flow is missing, or it differs from the feature spec. |
| Missing | No screen. |
| Hold | Screen exists but the feature's phase or content is undecided (phase OPEN). Do not change it until the open decision is closed. |
| Unverified | Not found in the docs or registry; check the code before syncing. |
| N/A | Nothing to show in this phase. |

**Platform scope.** Both clients carry every P1 feature (D-013), **except the admin portal, which is web only (D-015)**: every `ad_*` screen and the Super Admin role exist on web and nowhere on mobile, so admin rows show mobile `N/A`. P2 features are shown on both with a "Phase 2" badge (D-010). OPEN rows stay as they are.

**Maintaining this file.** Run `python docs/tools/check_docs.py` after any edit. It fails if a registry screen is unmapped, a screen ID does not exist, or a feature ID is missing from either file. See [05-maintenance-runbook.md](05-maintenance-runbook.md).

---

## 1. Feature to screen matrix

| ID | Web screens | Web | Mobile screens | Mobile | Sync action |
|---|---|---|---|---|---|
| F-ACC-01 | `splash` `welcome` `login` `otp` `register` | Done | `splash` `welcome` `login` `otp` `register` | Done | None. |
| F-ACC-02 | `c_profile` | Done | `c_profile` | Done | None. |
| F-ACC-03 | `acct_state` | Done | `acct_state` | Done | None. |
| F-ACC-04 | `c_delete` `c_settings` | Done | `c_delete` | Done | None. |
| F-ACC-05 |  | Missing |  | Missing | Both: design and add export-my-data and deletion explainer. |
| F-ACC-06 | `c_profile_edit` | Done | `c_profile_edit` | Done | None. |
| F-ACC-07 | `c_settings` | Done | `c_settings` | Done | Both: align channel and category preferences with F-MSG-05. |
| F-ACC-08 |  | Missing |  | Missing | Both: design and add session/device list for vendor and admin. |
| F-GEO-01 | `c_location` `c_home` | Done | `c_location` | Done | None. |
| F-GEO-02 | `c_location_wait` | Done | `c_location_wait` | Done | None. |
| F-GEO-03 | `ad_geo` | Done |  | N/A | None. Admin portal is web only (D-015). |
| F-GEO-04 | `ad_country` | Hold |  | N/A | None until O-04 is decided. Mobile has no admin (D-015). |
| F-GEO-05 |  | Missing |  | Missing | None until O-05 is decided. |
| F-GEO-06 | `v_areas` `v_profile` | Done | `v_areas` | Done | None. |
| F-GEO-07 |  | Missing |  | Missing | Both: show UAE / Singapore / more metros as Phase 2 rows in the rollout manager. |
| F-GEO-08 |  | Partial |  | Partial | Both: P1 shows INR only; tag the display-currency toggle "Phase 2". |
| F-TAX-01 | `c_categories` `c_category` | Done | `c_categories` `c_category` | Done | None. |
| F-TAX-02 | `ad_categories` `ad_cat_new` `ad_taxonomy` `ad_category` | Done |  | N/A | None. Admin portal is web only (D-015). |
| F-TAX-03 | `ad_category` | Done |  | N/A | None. Admin portal is web only (D-015). |
| F-TAX-04 | `c_cat_suggest` | Done | `c_cat_suggest` | Done | None. |
| F-TAX-05 |  | Done |  | Done | None. |
| F-TAX-06 |  | Missing |  | Partial | Both: list the 9 Phase 2 industries in the taxonomy with a Phase 2 badge. |
| F-TAX-07 |  | Missing |  | Partial | Both: list the 11 Phase 3 industries as roadmap only. |
| F-TAX-08 |  | Done |  | Done | None. |
| F-VND-01 | `v_register` `v_register_mfr` `v_register_svc` | Done | `v_register` `v_register_mfr` `v_register_svc` | Done | None. |
| F-VND-02 |  | Missing |  | Unverified | Both: confirm country is the first onboarding question. |
| F-VND-03 | `v_verify` | Done | `v_verify` | Done | Both: rename "Tier 1-3" to levels L0 to L3 and show dated badges. |
| F-VND-04 |  | Missing |  | Partial | Both: show L4 as Phase 2. |
| F-VND-05 | `v_listing_gate` | Done | `v_listing_gate` | Done | None. |
| F-VND-06 | `v_listings` `v_listing_edit` | Done | `v_listings` `v_listing_edit` | Done | None. |
| F-VND-07 | `ad_listings` `ad_listing` | Done |  | N/A | None. Admin portal is web only (D-015). |
| F-VND-08 | `v_avail` | Done | `v_avail` | Done | None. |
| F-VND-09 | `c_vendor` `v_public` `v_profile` | Done | `c_vendor` `v_public` `v_profile` | Done | None. |
| F-VND-10 | `v_dash` `v_more` `v_perf` | Done | `v_dash` `v_more` `v_perf` | Done | None. |
| F-VND-11 |  | Missing |  | Missing | None until O-09 is decided. |
| F-VND-12 |  | Missing |  | Missing | None until O-09 is decided. |
| F-DSC-01 | `c_home` | Done | `c_home` | Done | None. |
| F-DSC-02 | `c_explore` | Done | `c_explore` | Done | None. |
| F-DSC-03 | `c_explore_err` | Done | `c_explore_err` | Done | None. |
| F-DSC-04 | `c_explore_suppliers` | Done | `c_explore_suppliers` | Done | None. |
| F-DSC-05 | `c_listing` `c_listing_nodata` `c_listing_trade` | Done | `c_listing` `c_listing_nodata` `c_listing_trade` | Done | None. |
| F-DSC-06 | `c_product` | Done | `c_product` | Done | None. |
| F-DSC-07 | `c_saved` | Done | `c_saved` | Done | None. |
| F-DSC-08 |  | Missing |  | Missing | None until O-09 is decided. |
| F-DSC-09 |  | Missing |  | N/A | None until O-09 is decided. |
| F-DSC-10 |  | N/A |  | N/A | Roadmap only. |
| F-BKG-01 | `c_book_new` `c_booking` | Done | `c_book_new` `c_booking` | Done | Both: one status vocabulary (see PRS §8.2). |
| F-BKG-02 | `c_book_instant` | Done | `c_book_instant` | Done | None. |
| F-BKG-03 |  | Missing |  | Missing | Both: design and add recurring series (linked occurrences; cancel one vs all). |
| F-BKG-04 | `c_book_modify` `v_booking_mod` `c_booking` | Done | `c_book_modify` `v_booking_mod` | Done | None. |
| F-BKG-05 | `c_booking` | Done | `c_booking` | Done | None. |
| F-BKG-06 | `c_booking_done` `c_booking` | Done | `c_booking_done` | Done | None. |
| F-BKG-07 | `c_conflict` | Done | `c_conflict` | Done | None. |
| F-BKG-08 |  | Done |  | Done | None. |
| F-BKG-09 | `v_work` `v_booking` `v_leads` | Done | `v_work` `v_booking` `v_leads` | Done | None. |
| F-BKG-10 | `c_activity` | Done | `c_activity` | Done | Both: tab named "Activity"; include orders and contracts. |
| F-RFQ-01 | `c_rfq_new` | Done | `c_rfq_new` | Done | None. |
| F-RFQ-02 | `v_rfq` | Done | `v_rfq` | Done | None. |
| F-RFQ-03 | `c_rfq` `c_rfq_compare` | Done | `c_rfq` `c_rfq_compare` | Done | None. |
| F-RFQ-04 | `c_rfq_open` `c_rfq` | Done | `c_rfq_open` | Done | None. |
| F-RFQ-05 | `c_rfq_edit` | Done | `c_rfq_edit` | Done | None. |
| F-RFQ-06 | `c_rfq_none` | Done | `c_rfq_none` | Done | None. |
| F-RFQ-07 |  | Missing |  | Missing | Both: tag as Phase 2 where RFQ forms mention currency or trade terms. |
| F-GDS-01 | `c_listing_trade` `v_listing_edit` | Done | `c_listing_trade` | Done | None. |
| F-GDS-02 | `c_rfq_goods` | Done | `c_rfq_goods` | Done | None. |
| F-GDS-03 | `c_orders` `c_order` `v_orders` `v_order` | Done | `c_orders` `c_order` `v_orders` `v_order` | Done | None. |
| F-GDS-04 | `c_order_exc` `c_order` | Done | `c_order_exc` | Done | None. |
| F-GDS-05 | `c_order_failed` | Hold | `c_order_failed` | Hold | None until O-06 is decided. |
| F-GDS-06 |  | Missing |  | Missing | Both: design PO dispute outcomes. |
| F-GDS-07 |  | Missing |  | Missing | Both: tag as Phase 2. |
| F-GDS-08 |  | N/A |  | N/A | Roadmap only. |
| F-GDS-09 |  | N/A |  | N/A | Roadmap only. |
| F-CON-01 | `c_contract_new` `c_contract` `v_contract` | Done | `c_contract_new` `c_contract` `v_contract` | Done | None. |
| F-CON-02 |  | Missing |  | Partial | Both: add milestone confirmation and contract dispute link. |
| F-CON-03 |  | Missing |  | Missing | Both: show renewal, amendment, termination as Phase 2. |
| F-CON-04 |  | Missing |  | Missing | Both: tag e-sign provider as Phase 2. |
| F-CON-05 |  | Missing |  | Missing | None until O-08 is decided. |
| F-BIZ-01 | `b_eligibility` `b_register` `b_company` | Done | `b_eligibility` `b_register` `b_company` | Done | None. |
| F-BIZ-02 | `b_home` `b_services` `b_messages` `b_more` `v_biz_network` `v_biz_profile` | Done | `b_home` `b_services` `b_messages` `b_more` `v_biz_network` `v_biz_profile` | Done | None. |
| F-BIZ-03 | `c_companies` `c_company` `c_company_order` `b_orders` `b_order` | Hold | `c_companies` `c_company` `c_company_order` `b_orders` `b_order` | Hold | None until O-07 is decided. |
| F-BIZ-04 | `ad_company` | Done |  | N/A | None. Admin portal is web only (D-015). |
| F-BIZ-05 | `vb_home` `vb_explore` `vb_rfq` `vb_compare` `vb_order` `v_buy` | Done | `vb_home` `vb_explore` `vb_rfq` `vb_compare` `vb_order` `v_buy` | Done | None. |
| F-BIZ-06 | `team` | Done | `team` | Done | None. |
| F-MSG-01 | `messages` `chat` | Done | `messages` `chat` | Done | None. |
| F-MSG-02 |  | Partial |  | Partial | Both: finish contact-share consent. |
| F-MSG-03 |  | Missing |  | Hold | None until O-09 is decided. |
| F-MSG-04 | `notifications` | Done | `notifications` | Done | None. |
| F-MSG-05 |  | Missing |  | Missing | Both: design channel preferences and the admin template manager (replaces web "send notification"). |
| F-SUB-01 | `v_plans` `ad_plans` `v_profile` | Done | `v_plans` | Done | Both: show tier names with sample values and the "CFG-01 open" label; no prices (D-007). |
| F-SUB-02 | `v_sub` | Done | `v_sub` | Done | None. |
| F-SUB-03 | `v_checkout` `v_checkout_down` | Done | `v_checkout` `v_checkout_down` | Done | None. |
| F-SUB-04 | `ad_coupons` | Hold |  | Hold | None until O-02 is decided. |
| F-SUB-05 | `v_listings` | Done | `v_listings` | Done | None. |
| F-SUB-06 | `v_sponsor` `ad_sponsored` | Done | `v_sponsor` | Done | None. |
| F-SUB-07 | `ad_subs` `ad_sub` | Done |  | N/A | None. Admin portal is web only (D-015). |
| F-SUB-08 | `invoice` `fees` | Done | `invoice` `fees` | Done | None. |
| F-SUB-09 |  | N/A |  | N/A | Roadmap only. |
| F-PAY-01 |  | Missing |  | Unverified | Both: show agreed price/terms as a record with the "paid directly to the vendor" notice. |
| F-PAY-02 |  | Missing |  | Missing | Both: design invoice / offline-terms records for contracts. |
| F-PAY-03 | `c_pay` `c_payments` | Done | `c_pay` `c_payments` | Done | None. |
| F-PAY-04 | `c_wallet` | Done | `c_wallet` | Done | None. |
| F-PAY-05 | `c_refund` `c_refund_view` `v_refunds` | Done | `c_refund` `c_refund_view` `v_refunds` | Done | None. |
| F-PAY-06 | `v_payouts` | Done | `v_payouts` | Done | None. |
| F-PAY-07 | `ad_commission` | Done |  | N/A | None. Admin portal is web only (D-015). |
| F-PAY-08 | `c_pay_fx` | Done | `c_pay_fx` | Done | None. |
| F-PAY-09 |  | Missing |  | Missing | Both: tag as Phase 2 inside payout screens. |
| F-TRU-01 | `c_review` `c_review_no` `c_reviews` `v_reviews` | Done | `c_review` `c_review_no` `c_reviews` `v_reviews` | Done | None. |
| F-TRU-02 | `v_public` | Done | `v_public` | Done | None. |
| F-TRU-03 | `c_report` `c_cases` `c_case` `ad_cases` `ad_case` | Done | `c_report` `c_cases` `c_case` | Done | None. Web adopted the mobile "Cases" flow; the admin side is web only (D-015). |
| F-TRU-04 | `v_cases` `ad_reviews` | Done | `v_cases` | Done | None. |
| F-TRU-05 |  | Done |  | Done | None. |
| F-TRU-06 |  | Missing |  | Missing | Both: tag as Phase 2. |
| F-TRU-07 |  | Missing |  | Missing | None until O-09 is decided. |
| F-TRU-08 |  | N/A |  | N/A | Roadmap only. |
| F-AGT-01 | `a_home` `a_leads` `a_lead` `a_lead_new` `a_log` `a_followups` `a_profile` | Done | `a_home` `a_leads` `a_lead` `a_lead_new` `a_log` `a_followups` `a_profile` | Done | None. |
| F-AGT-02 | `a_onboard` | Done | `a_onboard` | Done | None. |
| F-AGT-03 | `a_tasks` | Done | `a_tasks` | Done | None. |
| F-AGT-04 | `a_perms` | Done | `a_perms` | Done | None. |
| F-AGT-05 | `a_perf` | Done | `a_perf` | Done | None. |
| F-AGT-06 | `a_earnings` | Partial | `a_earnings` | Partial | Both: sample commission amounts only; replace once O-03 defines the model. Commission approval is in the web admin agent detail. |
| F-AGT-07 | `ad_agents` `ad_agent` | Done |  | N/A | None. Mobile has no admin pages (D-015); the web admin agent detail shows the commission view. |
| F-AGT-08 |  | N/A |  | N/A | Roadmap only. |
| F-ADM-01 | `ad_dash` `ad_approvals` `ad_more` | Done |  | N/A | None. Admin portal is web only (D-015). |
| F-ADM-02 | `ad_vendors` `ad_vendor` | Done |  | N/A | None. Web admin only (D-015). |
| F-ADM-03 | `ad_users` `ad_user` `ad_customers` | Done |  | N/A | None. The customers filter is the `ad_customers` screen on web; mobile has no admin (D-015). |
| F-ADM-04 | `ad_roles` | Done |  | N/A | None. Admin portal is web only (D-015). |
| F-ADM-05 | `ad_audit` | Done |  | N/A | None. Admin portal is web only (D-015). |
| F-ADM-06 | `ad_analytics` | Partial |  | N/A | Web: add supply-gap and RFQ-health panels (RET-03, RET-06), date ranges and export. Mobile has no admin (D-015). |
| F-ADM-07 | `ad_settings` | Done |  | N/A | None. Admin portal is web only (D-015). |
| F-ADM-08 | `ad_cfg` | Done |  | N/A | None. Admin portal is web only (D-015). |
| F-ADM-09 |  | Missing |  | N/A | None until O-05 is decided. |
| F-ADM-10 |  | Missing |  | Missing | Both: design maintenance / force-update screen (the force-update half is a mobile-app concern; its configuration sits in the web admin). |
| F-ADM-11 |  | Missing |  | N/A | Web: tag as Phase 2. Mobile has no admin (D-015). |
| F-ADM-12 |  | Missing |  | N/A | Web: tag as Phase 2. Mobile has no admin (D-015). |
| F-ADM-13 | `ad_vendor_new` | Hold |  | N/A | None until O-01 is decided. The web screen is kept as it was, rebuilt on the shared data. |
| F-XCT-01 |  | Partial |  | Partial | Both: move the remaining hard-coded copy into the dictionary. |
| F-XCT-02 |  | Missing |  | Missing | Both: show language list and RTL as Phase 2. |
| F-XCT-03 | `ui_states` | Done | `ui_states` | Done | None. Both use the shared UI-states screen. |
| F-XCT-04 |  | Partial |  | Partial | Both: audit against WCAG 2.2 AA. |
| F-XCT-05 |  | Partial |  | Partial | Both: same terminology and status vocabulary; this matrix is the check. |
| F-XCT-06 | `c_dash` | Done | `c_dash` | Done | None. |
| F-XCT-07 |  | N/A |  | N/A | Roadmap only. |
| F-MCK-01 | `vision` `flows` `journeys` `journeys_pick` | Done | `vision` `flows` `journeys` `journeys_pick` | Done | Both: same five required demo journeys and a phase view generated from these docs. |

## 2. Web screens to retire or fold in

Applied under decision D-009 ("drop web-only admin screens that are not in the PRS"). The sync pass of 2026-10-29 17:21 removed all twelve from the web registry and code; the checker now fails if one comes back. Where the disposition says "Fold in" or "Replace", the content named is **not yet built** into the target feature (see that feature's sync action).

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
| Demo credentials | One OTP (123456), admin MFA 654321 | One OTP (123456); no admin on mobile | Same scheme on both. **Done.** |
| Admin in role picker | Visible (web only) | No admin role at all | Closed by D-015: the admin portal is web only. **Done.** |
| Persistence | In memory (web localStorage persistence was removed in the sync) | In memory | Both reset on reload. **Done.** |
| Screen counts in READMEs | Out of date | Says 93 and 111 | Generated from the registry (web 166, mobile 132). Open. |
| Verification wording | "Tier 1 to 4" | "Tier 1 to 4" | "Level L0 to L4" everywhere. Open (F-VND-03). |
| Support wording | Cases | Cases | "Cases". **Done.** |
| Layout | Desktop header, admin sidebar, content column up to 880 px (1040 px with the sidebar) | Phone frame, bottom tabs | Only the shell differs; every screen component is the same code. |

## Change Log

| Date & time (YYYY-MM-DD HH:MM, local) | Updated by | Change | Reason |
|---|---|---|---|
| 2026-10-30 11:05 | Shil1517 | Modified: web `Screen` desktop theme for all web screens (desktop page header replaces the phone app bar, content widths 760/960/1200px, larger spacing); features and rules unchanged, status stays Done | Owner asked for web page layout, padding and spacing in a desktop theme rather than a scaled-up mobile layout. |
| 2026-10-30 10:40 | Shil1517 | Modified: web shell and `Screen` layout for all web screens (full-width shell, wider centred content on desktop); `c_explore`, `c_activity`, `c_saved`, `c_categories`, `c_profile` use desktop grids; features and rules unchanged, status stays Done | Web pages looked like a mobile column on desktop; web needs a proper web layout with the same functionality. |
| 2026-10-30 10:15 | Shil1517 | Modified: `c_home` web layout only (responsive multi-column grid on desktop, full-width shell); features and rules unchanged, status stays Done | Web home rendered as a narrow mobile column on desktop; web needs a proper desktop layout with the same functionality. |
| 2026-10-29 17:21 | Shil1517 | Modified: every row; web screens now equal mobile screens; mobile admin screens removed (mobile status N/A); section 2 retirements applied in code; section 3 differences updated; Added: `a_earnings` on both for F-AGT-06 | Mockup sync of web to mobile and removal of the admin portal from mobile (D-015). |
| 2026-10-29 16:27 | Shil1517 | Added: sync matrix for all features; 12 retired/folded web screens | Needed a per-feature work list so web and mobile mockups can be synced to one spec. Retirements follow D-009. |
