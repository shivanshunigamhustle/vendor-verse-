# 10 · Acceptance Testing Checklist

> **Detail document, not yet reviewed against the 2026-10-29 decisions** (see [../../../docs/04-decisions-log.md](../../../docs/04-decisions-log.md)). Phase labels follow the spec in [../../../docs/01-feature-spec.md](../../../docs/01-feature-spec.md) where they differ.


Run against the real build (not the mockup). Each item should record: tester, date, build number, pass/fail, defect link.
Format: `[ ]` = not yet run. Severity on failure: **S1** blocks release · **S2** must fix before launch · **S3** can follow.

## A. Journeys (end to end)

- [ ] **J1** Customer searches nearby, opens a provider, books a service, sees status updates
- [ ] **J2** Business buyer searches suppliers → product with MOQ/tiers → goods RFQ → compares quotes → accepts → PO created
- [ ] **J3** Vendor registers, uploads evidence, admin approves, vendor adds listing and receives a lead
- [ ] **J4** Admin creates category with fields, publishes, sees it in search; reviews a vendor and approves/rejects with reason
- [ ] **J5** Vendor switches to buyer mode, sends bulk RFQ, accepts quote, tracks PO
- [ ] **J6** Owner passes eligibility, submits 6-step company form, admin verifies, company is live
- [ ] **J7** Vendor opens Business network, views company, can message only (no RFQ/booking)

## B. Accounts and security

- [ ] Register and log in with phone OTP and with email OTP
- [ ] Wrong/expired OTP rejected; OTP request rate-limited per phone, IP and device
- [ ] Admin login requires MFA; session expires; device list shows and revokes sessions
- [ ] One identity switches between customer and vendor without gaining privileges
- [ ] Suspended / restricted / deleted account states block the correct actions
- [ ] Account deletion request anonymises PII within the policy window; legal-hold data retained
- [ ] User can export their data
- [ ] A user cannot read another user's bookings, RFQs, orders, chats or documents (test with direct ID access)
- [ ] Staff cannot approve their own submissions (self-approval blocked)
- [ ] Every high-impact admin action requires a reason and appears in the audit log with correlation ID
- [ ] Sales agent cannot approve, publish, change billing, or see customer transactions/chats/other agents' leads
- [ ] Uploaded files are virus-scanned; wrong types and oversize files rejected
- [ ] Contact details are hidden until booking confirmed; contact-sharing needs consent

## C. Geography and taxonomy

- [ ] Country → state → city → pincode selection works; unlaunched city shows waitlist and accepts sign-up
- [ ] Admin opens a city and it goes live without a release
- [ ] Admin adds an industry, category, subcategory and custom fields; they drive onboarding, listing form, RFQ form and search filters
- [ ] Category cannot be published without booking mode, verification rule, deadline and cancellation policy
- [ ] Changing a category schema versions it; existing listings keep their version
- [ ] Suggest-a-category reaches admin; approve, merge and reject all notify the requester

## D. Vendor onboarding and publication

- [ ] All four vendor types show the correct evidence requirements
- [ ] Reviewer can approve, reject with reason, or request more info; vendor sees the outcome
- [ ] Rejected vendor can appeal/resubmit
- [ ] Credential expiry reminders fire; expiry removes the listing from search (gate 4)
- [ ] Each of the six gates blocks publication independently: account · content review · subscription · verification · required fields + area · holds
- [ ] Publication status is derived live; changing one input flips visibility in search within the agreed delay
- [ ] Duplicate listing detection flags a copy
- [ ] Listing count respects plan limit

## E. Discovery

- [ ] Search matches by pincode/city coverage; ineligible listings never appear
- [ ] Filters on category custom fields work; pagination stable
- [ ] Plan tier does not affect organic ranking; sponsored slots are labelled
- [ ] "Outside your area" and missing-data labels shown honestly
- [ ] No-result flow offers broader search / RFQ / waitlist
- [ ] Compare up to 3; favourites persist across devices
- [ ] Search error/offline state allows retry

## F. Booking

- [ ] Instant booking confirms with ETA; slot cannot be double-booked under concurrent requests
- [ ] Scheduled request: accept, decline and expiry (deadline) all update both sides
- [ ] Idempotent create: double-tap creates one booking
- [ ] Modification keeps original terms until accepted; decline leaves original in force
- [ ] Customer and vendor cancellation apply the category policy; vendor cancellation recorded, no auto-penalty
- [ ] Conflicting confirmations show the chooser; exactly one wins
- [ ] Completion: vendor marks done; customer confirms or auto-closes after 7 days
- [ ] Review is available only after a closed, eligible transaction

## G. RFQ, quotes, orders, contracts

- [ ] RFQ form follows the category schema; attachments scanned
- [ ] Only eligible vendors receive the RFQ
- [ ] Quote contains price, scope, inclusions, exclusions, timeline, validity; revise, withdraw, expire work
- [ ] Edit RFQ creates a revision and notifies quoting vendors
- [ ] No-quote path: extend deadline or widen recipients
- [ ] Two simultaneous accepts: exactly one winner; others see "not selected"
- [ ] Accepted-terms snapshot is immutable and creates the correct next record (work order / PO / contract)
- [ ] PO moves through created → accepted → paid/terms → processing → shipped → delivered → completed
- [ ] PO payment-failed retry window and delivery-exception paths behave as specified; dispute outcome recorded
- [ ] Contract: propose, counter, e-sign by both parties, milestone completion

## H. Messaging and notifications

- [ ] Chat is linked to one transaction; non-parties cannot join
- [ ] Phone/email/link sharing is filtered before consent
- [ ] Customers cannot message or RFQ a Business (company) account; vendors can only message
- [ ] Report from chat creates a case with the conversation as evidence
- [ ] Every notification opens the correct destination screen
- [ ] User preferences per channel are honoured; quiet hours respected; opt-out works

## I. Trust and safety

- [ ] Report → case with severity and SLA; breach raises an alert
- [ ] Emergency restriction applies immediately and is queued for post-review
- [ ] Appeal is decided by a human other than the original decider
- [ ] Review moderation hides abusive content; reviewer is notified
- [ ] Case-bound conversation access only for staff assigned to the case

## J. Subscriptions and revenue

- [ ] Purchase a plan with tax, coupon and proration; invoice generated with correct GST fields
- [ ] Renewal failure → 3-day grace → expiry; listings follow gate 3
- [ ] Downgrade scheduled for period end; upgrade prorates
- [ ] Billing webhooks are idempotent (replay does nothing); out-of-order events handled
- [ ] Admin correction is authorised, reasoned and audited
- [ ] Sponsored campaigns cannot make an ineligible listing visible
- [ ] Lead-usage meter and plan limits enforce correctly

## K. Agents and admin

- [ ] Agent assisted onboarding is impossible without recorded consent
- [ ] Conversion metrics match actual onboarding outcomes
- [ ] Admin queues show correct counts; filters and SLA timers work
- [ ] Analytics numbers reconcile with database counts for a known test dataset
- [ ] Config register values change behaviour without a deployment

## L. Non-functional

- [ ] **Performance:** search p95 < 800 ms at 200 concurrent users; booking create p95 < 1 s; page LCP < 2.5 s on mid-range Android over 4G
- [ ] **Load:** 5× expected launch traffic for 30 minutes without errors
- [ ] **Availability:** health checks, graceful degradation when SMS/payment/KYC providers are down
- [ ] **Security:** pen test report with no open critical/high; OWASP ASVS L2 checklist; secrets not in code; dependency scan clean
- [ ] **Privacy:** consent screens, data export, deletion, retention jobs verified
- [ ] **Accessibility:** WCAG 2.2 AA audit passed on all MVP screens (screen reader, contrast, touch targets, focus order)
- [ ] **Localisation:** English and Hindi complete; no truncation; dates, numbers, currency formatted per locale
- [ ] **Compatibility:** Android 9+ and iOS 15+; phones of small, medium and large screen sizes; tablets render without breakage
- [ ] **Resilience:** flaky network, app killed mid-booking, double-submit, clock skew
- [ ] **Backup & recovery:** restore from backup tested; RPO ≤ 15 min, RTO ≤ 4 h
- [ ] **Observability:** alerts fire for webhook failures, queue backlog, error spike
- [ ] **Release:** store listings, privacy labels, terms and privacy policy published

## M. Sign-off

| Role | Name | Date | Decision |
|---|---|---|---|
| Product owner | | | |
| QA lead | | | |
| Tech lead | | | |
| Security | | | |
| Client sponsor | | | |

## Change Log

| Date & time (YYYY-MM-DD HH:MM, local) | Updated by | Change | Reason |
|---|---|---|---|
| 2026-10-29 16:27 | Shil1517 | Modified: added pointer banner | Added pointer to the new docs/ set; content review still outstanding |
