# VendorVerse: Web vs Mobile Mockup Gap Analysis

> **Superseded (2026-10-29).** Scope, phases and mockup status now live in [../docs/01-feature-spec.md](../docs/01-feature-spec.md), [../docs/03-mockup-sync-matrix.md](../docs/03-mockup-sync-matrix.md) and [../docs/04-decisions-log.md](../docs/04-decisions-log.md). Kept for background; phase labels and counts below may be out of date. **Web sync pass of 2026-10-30:** the web gaps in sections 2 to 12 were worked through against the sync matrix; the web app now has 172 screens. Items still open on web are listed as Partial or Missing in the matrix.


Analysis only. No code was changed. Compared: screen registries, roles and navigation, stores and seed data, READMEs, and the web GAP_REPORT. Counts come from grepping the source, not from clicking through both apps.

**Overall:** the two apps are built on different versions of the requirements. The mobile app models the global-marketplace brief and is the more complete of the two. Web is the older India-centric base with a global layer added on top. It has 88 screens against 162 on mobile.

## 1. Structure and shell
| # | Area | Web | Mobile |
|---|---|---|---|
| 1 | Screen count | 88 screens | 162 screens. The README says "93" and "111" in different places, so its own docs disagree. |
| 2 | Shell | Responsive website with header, desktop sidebars and a country/currency selector | Phone frame with status bar, a requirements side panel, and a 40-scenario jump list |
| 3 | Public landing | `c_home` is a marketplace website home. It also has a `scope_review` screen. | `c_home` is a plain app home. It has no scope-review screen. |
| 4 | Persistence | Saved to `localStorage` through `browserRepository` and an authorization service | In-memory only, resets on reload |
| 5 | Demo credentials | A different OTP per role (111111, 222222, 121212, 020905, 261205), and the admin has no second step | One OTP (123456) plus admin MFA code 654321 |
| 6 | Admin visibility | Admin is a visible role with a sidebar | Admin is hidden from the role picker (`HIDE_ADMIN = true`) but is still in the code |
| 7 | Mobile-only meta screens | None | `vision`, `fees`, `flows`, `journeys`, `journeys_pick`, `ui_states`, `acct_state`, `invoice` |

## 2. Roles and navigation
| # | Area | Web | Mobile |
|---|---|---|---|
| 8 | Business role | Reuses the vendor screens (`HOME.business = 'v_dash'`) and has the same tabs as vendor. | Separate account type with its own `b_*` screens and tabs: Home, Company, Services, Messages, More. It also has an eligibility gate of 3+ years and registered. |
| 9 | Vendor tabs | Dashboard, Quotes, Listings, Messages, More | Dashboard, Work, Listings, **Buy**, Messages, More |
| 10 | Customer Activity tab label | "Quotes" | "Activity" |
| 11 | Agent tabs | Home, Leads, Follow-ups, **Earnings**, Profile | Home, Leads, Follow-ups, **Performance**, Profile |
| 12 | Admin reports tab | `ad_reports` | `ad_analytics` |
| 13 | Account model | No customer/vendor mode switch. Web uses `hasVendorAccount` and a role toggle. | One identity with mode switching: `c_profile` is "Profile & mode switch" and `team` is the business team. |

## 3. Auth and accounts
| # | Gap |
|---|---|
| 14 | Mobile has account states (`acct_state`), a delete-account screen (`c_delete`) and a deletion-request flow. Web has only light deletion handling (12 hits against 51). |
| 15 | Web has a scope-review screen for the requirements. Mobile does not. |

## 4. Discovery, location and taxonomy
| # | Area | Web | Mobile |
|---|---|---|---|
| 16 | Categories | 8 India-style base categories (Electrical & Hardware, Construction Material, Office & IT…) plus about 20 extra generated ones. The extra ones have no Hindi names (`hi` is set to the English `name`) and their subcategories are generated. | 10 top-level groups plus a 30-industry taxonomy with category counts, an admin taxonomy builder, and a "suggest a category" flow. |
| 17 | Geography | A country dropdown with currency and a city list | Country → state → city picker, "city not live" waitlist, geo rollout manager (`ad_geo`) and country packs (`ad_country`). Web has no "waitlist" anywhere. |
| 18 | Search | Single `c_explore` | Adds a suppliers and manufacturers search (`c_explore_suppliers`), an error/offline state (`c_explore_err`), pincode matching and pagination. Web has almost none of these. |
| 19 | Listing states | Single `c_listing` | Also has trade details (`c_listing_trade`), a missing-data variant (`c_listing_nodata`) and a product page with MOQ and tiers (`c_product`). |
| 20 | Volume or tier pricing | Not present (0 hits) | Present (59 hits) |
| 21 | Currency conversion | Currency follows the chosen country | Adds a foreign-currency checkout and a display-currency toggle |

## 5. Booking
| # | Gap |
|---|---|
| 22 | Mobile has instant booking (`c_book_instant`), confirm completion after 7 days, request a change, conflicting confirmations, and a vendor-side change request (`v_booking_mod`). In web, instant, recurring and contract modes are missing, per its own GAP_REPORT. |
| 23 | Status vocabulary differs. Web uses requested, confirmed, completed, cancelled, reschedule, awaiting. Mobile follows a fuller state machine with deadlines, expiry, a terms snapshot and idempotent creation. |
| 24 | Vendor booking: mobile has a dedicated `v_booking` screen. Web handles bookings inside `v_work`. |

## 6. RFQ and quotations
| # | Gap |
|---|---|
| 25 | Mobile adds edit RFQ (revision), no quotes received, accepted-terms snapshot, deadline extension, a goods RFQ with specs and delivery, a goods quote comparison, and a work order. Web has none of these. |
| 26 | Web has one `c_rfq_new` and one `c_rfq`. It has no deadline extension (0 hits) and no work order (0 hits). |

## 7. Orders, payments and money
| # | Gap |
|---|---|
| 27 | Mobile has checkout and escrow (`c_pay`), a payments hub, a wallet, refund request and status, invoices, payouts, a foreign-currency checkout, and failed and exception order states. Web has a single create-PO screen and a tracking screen. It has no escrow and no refund screens, and only about 2 invoice hits. |
| 28 | Mobile has a vendor earnings and payouts screen (`v_payouts`), plan checkout (tax, coupon, proration), a scheduled downgrade, and a refunds-and-bank-verification screen. Web has none of these. |
| 29 | The two disagree on the payment model. Mobile README says MVP is direct payment, and the escrow screens are tagged Phase 2. Web's own coverage doc says the mock collects no payments. That conflict needs a decision. |
| 30 | Mobile has contracts: propose, e-sign and milestones on the customer side, and respond, counter and sign on the vendor side. In web, contracts are missing entirely (no milestone hits). |
| 31 | Mobile has company storefronts and ordering from companies (`c_companies`, `c_company`, `c_company_order`). Web has no storefront. |
| 32 | Mobile has a vendor-as-buyer mode with its own flow (`vb_*`). Web has only a "Buy as a business" row in `v_more`. |

## 8. Vendor module
| # | Area | Web | Mobile |
|---|---|---|---|
| 33 | Onboarding | One registration screen, a business onboarding screen, and verification status | A wizard that picks the type, with separate manufacturer and service-provider paths, plus a 6-gate publication checklist. |
| 34 | Service areas and availability | Not separate screens | `v_areas` and `v_avail` |
| 35 | Plans and subscription | Plans are **Normal ₹499 (25 listings), Pro ₹999, Premium ₹1999**. Vendor data uses Starter, Growth and Pro. | Plans are **Free, Starter ₹499 (3 listings), Growth ₹1499 (10), Pro ₹3999**. |
| 36 | Subscription screens | Plan shown on the profile and in More | `v_sub`, `v_plans`, `v_sponsor`, `v_checkout` and billing events. It also has a grace period and a lead-usage meter, both missing in web. |
| 37 | Moderation and appeals | Not present (0 hits) | `v_cases` and review appeals (80 hits) |
| 38 | Public profile | Not separate | `v_public` shows trust |
| 39 | Leads | Folded into Quotes | `v_leads`, `v_order` |

## 9. Customer module
| # | Gap |
|---|---|
| 40 | Mobile has a customer dashboard (`c_dash`), "My reviews" (`c_reviews`), and a review-not-eligible screen. Web has only the review form. |
| 41 | Mobile has support cases and evidence (`c_cases`, `c_case`). Web has Issues and IssueDetail. The names and flow differ. |
| 42 | Mobile has a location picker and a category suggestion screen. Web has neither. |

## 10. Agent
| # | Gap |
|---|---|
| 43 | **Direct contradiction:** web agents see Commissions and Earnings (`a_earnings`, commission appears 9 times in the agent screen). Mobile agents see conversion performance only, with no commissions, and the README says commissions were deliberately removed. |
| 44 | Mobile adds `a_tasks` (assigned onboarding tasks) and `a_perms` (what agents can and cannot do). Web has neither. |
| 45 | Mobile's agent lead list is titled "Prospective vendors". Web's is just "Leads". |

## 11. Admin
Web has 28 admin screens that mobile lacks. Mobile has 24 that web lacks.

- **Web only:**
  - Operations: coupons, notifications, photo approvals, previous work, profile images, shop leads, FAQs and customers.
  - RFQ Console: requirements, supply gaps, quote moderation, category templates and RFQ health.
  - Separate listings for platform settings and plans.
- **Mobile only:**
  - Support and moderation: cases and case resolution, review moderation and appeals.
  - Money: subscription monitoring and billing investigation, sponsored campaigns, plans and entitlements, revenue and commission.
  - Governance and setup: the open configuration register (CFG-01…12), geo rollout manager, country packs, company verification queue, create category, and taxonomy builder.
- Web has `ad_vendor_new` (add a vendor or business supplier). Mobile has no equivalent.
- Dispute naming: web uses disputes (`ad_disputes`, `ad_dispute`). Mobile uses cases (`ad_cases`, `ad_case`).
- Admin plan editor: web edits Normal, Pro and Premium and has coupons. Mobile edits entitlements by plan and has no coupon admin.
- Both lack dual approval and self-approval blocking as a coded feature, although the mobile README claims self-approval is blocked.

## 12. Cross-cutting
| # | Area | Web | Mobile |
|---|---|---|---|
| 46 | Trust | No verification tiers, trust score or rating dimensions | 4 verification tiers, a trust score, and 4-dimension ratings |
| 47 | State and error screens | Few retry or offline states | `ui_states` plus dedicated error, empty and offline screens |
| 48 | Hindi and i18n | A dictionary of about 80 keys on the home page. The web GAP_REPORT says Hindi encoding is damaged and copy is hard-coded. | A smaller dictionary, with Hindi labels for state codes |
| 49 | Tax | GST-centric | A tax table for 7 countries, with reverse charge and proration |
| 50 | Docs | GAP_REPORT and requirements-coverage only. Both are out of date relative to the code. | A docs folder with a 10-part deliverables set, screen-inventory CSV and roadmap. Its README counts (93 and 111 screens) do not match the 162 in the registry. |
| 51 | Spec content | `specs.js` holds the SRS v1.0 FR/NFR content (94 lines) | `specs.js` holds the PRS content, with scenario links per screen (133 lines) |

## Biggest decisions to make
1. Pick one source-of-truth requirements version. Web still follows SRS v1.0 and mobile follows PRS v3.
2. Choose one payment model, direct payment for MVP or escrow, and tag the screens accordingly (#29).
3. Resolve the agent commissions contradiction (#43).
4. Align the plan names and prices: Normal, Pro and Premium against Free, Starter, Growth and Pro (#35).
5. Decide whether Business is a separate account (mobile) or a vendor variant (web) (#8).
6. Decide which admin consoles belong on both sides: the web RFQ Console and Ops screens, or the mobile subscription, case and geo screens (#11).

## Change Log

| Date & time (YYYY-MM-DD HH:MM, local) | Updated by | Change | Reason |
|---|---|---|---|
| 2026-10-30 16:42 | Shil1517 | Modified: noted the web sync pass in the banner | Web gaps in this snapshot were addressed on 2026-10-30; the matrix holds the current status. |
| 2026-10-29 16:27 | Shil1517 | Modified: added pointer banner | Marked superseded by the new docs/ set (owner decisions D-001 to D-014) |
