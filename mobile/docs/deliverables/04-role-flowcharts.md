# 04 · Customer, Vendor, Agent and Admin Flowcharts

Diagrams use Mermaid (renders on GitHub, VS Code preview, and most docs tools). Screen IDs in brackets match `docs/screen-inventory.csv`.

## 1. Customer

```mermaid
flowchart TD
  A[Open app] --> B[Welcome & language]
  B --> C[Log in / Register: phone or email + OTP]
  C --> D[Home: pick location]
  D --> D1{City live?}
  D1 -- No --> D2[Join waitlist]
  D1 -- Yes --> E[Search or browse category]
  E --> F[Filter, rank, compare up to 3, favourite]
  F --> G[Listing / Vendor profile]
  G --> H{What does the customer need?}
  H -- Service now --> I1[Instant booking]
  H -- Service on a date --> I2[Request booking]
  H -- Custom or bulk --> I3[Create RFQ]
  H -- Recurring or project --> I4[Propose contract]
  H -- Goods --> I5[Product page → Goods RFQ]
  I1 --> J[Booking confirmed with ETA]
  I2 --> K[Vendor accepts / declines / expires]
  K -- Accepts --> J
  K -- Declines or expires --> E
  I3 --> L[Compare quotes → Accept one]
  L --> M[Accepted-terms snapshot + work order]
  I4 --> N[Counter → e-sign → milestones]
  I5 --> O[Compare quotations → Purchase order]
  J --> P[Service delivered]
  M --> P
  N --> P
  O --> Q[PO delivered]
  P --> R[Confirm completion within 7 days]
  Q --> R
  R --> S[Rate vendor — verified transactions only]
  R --> T[Report an issue → Support case]
  S --> U[Close]
  T --> U
```

**Side flows:** suggest a category · modify or cancel a booking · edit RFQ (revision) · profile (individual/business) · notification and privacy settings · delete account request.

## 2. Vendor

```mermaid
flowchart TD
  A[Register: one identity] --> B[Switch to vendor mode]
  B --> C[Choose type: service / contractor / manufacturer / supplier]
  C --> D[Onboarding wizard + category custom fields]
  D --> E[Upload verification evidence]
  E --> F{Admin review}
  F -- Needs info --> E
  F -- Rejected with reason --> G[Appeal / resubmit]
  F -- Approved tier 1-3 --> H[Choose subscription plan]
  H --> I[Pay plan: tax, coupon, proration]
  I --> J[Create listing]
  J --> K[Publication checklist: 6 gates]
  K -- Any gate fails --> L[Fix: account, content, subscription, verification, fields/area, holds]
  L --> K
  K -- All pass --> M[Listing public]
  M --> N[Set availability and service areas]
  N --> O[Receive leads: bookings, RFQs, orders, contracts]
  O --> P{Lead type}
  P -- Booking --> P1[Accept / decline / propose change]
  P -- RFQ --> P2[Submit or revise quotation]
  P -- Purchase order --> P3[Accept → process → ship]
  P -- Contract --> P4[Counter → sign]
  P1 --> Q[Deliver service]
  P2 --> Q
  P3 --> Q
  P4 --> Q
  Q --> R[Customer confirms; review received]
  R --> S[Performance metrics; handle moderation / appeals]
  S --> T[Renew plan or enter grace]
```

**Side flows:** sponsored visibility · business network (message a verified company) · buyer mode for vendor-to-vendor procurement · credential expiry reminders.

## 3. Business (company) account

```mermaid
flowchart LR
  A[Vendor owner] --> B{Eligible? owner, 3+ yrs, registered}
  B -- No --> X[Not eligible]
  B -- Yes --> C[Company form: 6 steps]
  C --> D[Admin company verification]
  D -- Approved --> E[Company live: services for vendors]
  D -- Rejected --> C
  F[Vendor] --> G[Business network] --> H[View company profile] --> I[Message only]
```

## 4. Sales agent

```mermaid
flowchart TD
  A[Agent home & pipeline] --> B[Add lead or open assigned lead]
  B --> C[Log call / message / visit]
  C --> D[Schedule follow-up]
  D --> E{Vendor agrees to be helped?}
  E -- No --> F[Mark lost with reason]
  E -- Yes --> G[Record consent]
  G --> H[Assisted onboarding: fill forms, upload docs]
  H --> I[Track reviewer decision and subscription status]
  I --> J[Relay missing evidence / help renewal]
  J --> K[Handover note → conversion counted]
```

**Hard limits:** agent cannot approve or reject verification, publish or edit listings, touch billing/refunds, read customer transactions or chats, or see other agents' leads.

## 5. Admin (staff)

```mermaid
flowchart TD
  A[Login + authenticator MFA] --> B[Dashboard & operational queues]
  B --> Q1[Verification queue]
  B --> Q2[Listing review queue]
  B --> Q3[Company verification]
  B --> Q4[Trust & support cases]
  B --> Q5[Review moderation & appeals]
  B --> Q6[Subscriptions & billing]
  B --> Q7[Taxonomy & category suggestions]
  B --> Q8[Geo rollout / country packs]
  Q1 --> D1[Approve / reject / request info — reason required]
  Q2 --> D2[Approve / pause / restrict; duplicate check]
  Q4 --> D4[Triage by severity & SLA → decide → notify]
  Q5 --> D5[Human re-review of appeal]
  Q6 --> D6[Investigate billing event; authorised correction]
  Q7 --> D7[Build / merge / publish category]
  Q8 --> D8[Open city or country]
  D1 --> L[(Audit log with correlation ID)]
  D2 --> L
  D4 --> L
  D5 --> L
  D6 --> L
  D7 --> L
  D8 --> L
```

**Rules:** self-approval blocked (separation of duties); every high-impact action captures a reason; RBAC scopes per staff role; admin sessions require MFA.
