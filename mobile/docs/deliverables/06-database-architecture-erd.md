# 06 · Proposed Database Architecture / ERD

> **Detail document, not yet reviewed against the 2026-10-29 decisions** (see [../../../docs/04-decisions-log.md](../../../docs/04-decisions-log.md)). Phase labels follow the spec in [../../../docs/01-feature-spec.md](../../../docs/01-feature-spec.md) where they differ.


## 1. Architecture choices

| Concern | Choice | Why |
|---|---|---|
| Primary store | **PostgreSQL 16** | Strong relational integrity for bookings/quotes/billing; JSONB for category attributes; row-level locking for atomic accept and slot booking. |
| Geo | PostGIS | Service-area and pincode/radius matching. |
| Search | OpenSearch / Elasticsearch (read model) | Filters on dynamic attributes, geo, ranking. Fed from Postgres via outbox events. |
| Cache / queues | Redis | OTP, rate limits, sessions, deadline timers, job queues. |
| Files | S3-compatible object storage + virus scan | Evidence, listing media, RFQ attachments, invoices. |
| Analytics | Event stream → warehouse (later) | Keeps reporting load off OLTP. |
| Audit | Append-only table, partitioned monthly | Immutable trail with correlation IDs. |

**Principles**
1. **Config over code.** Categories, attribute schemas, plans, policies and country packs are versioned rows.
2. **Computed publication.** `listing.is_public` is never stored; it is derived from the six gates (use a SQL view / service, plus a denormalised search flag updated by events).
3. **Snapshots are immutable.** Accepted terms, booking terms and contract versions are copied into snapshot rows.
4. **One identity, many modes.** A `user` may have customer, vendor, business and staff profiles; mode is not a privilege.
5. **Soft delete + anonymise** for DPDP-style deletion; financial and audit records retained per law.
6. **Money** as integer minor units + ISO currency code. No floats.
7. Every table: `id` (UUIDv7), `created_at`, `updated_at`; tenant-like scoping by `country_code` where relevant.

## 2. ERD — identity, vendors and listings

```mermaid
erDiagram
  USER ||--o{ SESSION : has
  USER ||--o| CUSTOMER_PROFILE : may_have
  USER ||--o| VENDOR : may_own
  USER ||--o| STAFF_PROFILE : may_be
  USER ||--o{ ADDRESS : has
  VENDOR ||--o{ VENDOR_DOCUMENT : submits
  VENDOR ||--o{ VERIFICATION : has
  VENDOR ||--o{ LISTING : owns
  VENDOR ||--o{ SERVICE_AREA : covers
  VENDOR ||--o{ AVAILABILITY_RULE : sets
  VENDOR ||--o| COMPANY : "may link to"
  COMPANY ||--o{ COMPANY_DOCUMENT : submits
  INDUSTRY ||--o{ CATEGORY : contains
  CATEGORY ||--o{ SUBCATEGORY : contains
  CATEGORY ||--o{ CATEGORY_FIELD : defines
  CATEGORY ||--o{ CATEGORY_VERSION : versioned_as
  LISTING }o--|| CATEGORY : in
  LISTING ||--o{ LISTING_MEDIA : has
  LISTING ||--o{ PRODUCT_TIER : prices
  LISTING ||--o{ LISTING_REVIEW : moderated_by
  COUNTRY ||--o{ STATE : has
  STATE ||--o{ CITY : has
  CITY ||--o{ PINCODE : has
  CITY ||--o| CITY_LAUNCH : status
  CATEGORY ||--o{ CITY_LAUNCH_CATEGORY : enabled_in

  USER {
    uuid id PK
    string phone
    string email
    string status
    string locale
  }
  VENDOR {
    uuid id PK
    uuid user_id FK
    string type
    string tier
    string state
  }
  LISTING {
    uuid id PK
    uuid vendor_id FK
    uuid category_id FK
    int category_version
    jsonb attributes
    string content_state
  }
  CATEGORY_FIELD {
    uuid id PK
    uuid category_id FK
    string key
    string type
    bool required
    bool filterable
  }
```

## 3. ERD — transactions

```mermaid
erDiagram
  CUSTOMER_PROFILE ||--o{ BOOKING : requests
  LISTING ||--o{ BOOKING : booked
  BOOKING ||--o{ BOOKING_EVENT : timeline
  BOOKING ||--|| BOOKING_TERMS_SNAPSHOT : freezes
  BOOKING ||--o{ BOOKING_MODIFICATION : changes
  CUSTOMER_PROFILE ||--o{ RFQ : creates
  RFQ ||--o{ RFQ_REVISION : versions
  RFQ ||--o{ RFQ_RECIPIENT : sent_to
  RFQ ||--o{ QUOTE : receives
  QUOTE ||--o{ QUOTE_REVISION : versions
  QUOTE ||--o{ QUOTE_LINE : itemises
  RFQ ||--o| ACCEPTED_TERMS_SNAPSHOT : freezes
  ACCEPTED_TERMS_SNAPSHOT ||--o| WORK_ORDER : produces
  ACCEPTED_TERMS_SNAPSHOT ||--o| PURCHASE_ORDER : produces
  ACCEPTED_TERMS_SNAPSHOT ||--o| CONTRACT : produces
  PURCHASE_ORDER ||--o{ PO_LINE : contains
  PURCHASE_ORDER ||--o{ PO_EVENT : timeline
  PURCHASE_ORDER ||--o{ SHIPMENT : ships
  CONTRACT ||--o{ CONTRACT_VERSION : versions
  CONTRACT ||--o{ MILESTONE : schedules
  CONTRACT ||--o{ SIGNATURE : signed_by
  BOOKING ||--o| REVIEW : "may earn"
  PURCHASE_ORDER ||--o| REVIEW : "may earn"
  WORK_ORDER ||--o| REVIEW : "may earn"
  REVIEW ||--o{ REVIEW_RATING : "4 dimensions"
  CONVERSATION ||--o{ MESSAGE : holds
  CONVERSATION }o--|| BOOKING : "linked to one of"

  BOOKING {
    uuid id PK
    uuid listing_id FK
    uuid customer_id FK
    string mode
    string state
    timestamp slot_start
    timestamp slot_end
    timestamp response_due
    string idempotency_key
  }
  RFQ {
    uuid id PK
    uuid customer_id FK
    uuid category_id FK
    string kind
    string state
    int current_revision
    timestamp quote_deadline
  }
  QUOTE {
    uuid id PK
    uuid rfq_id FK
    uuid vendor_id FK
    string state
    bigint total_minor
    string currency
    date valid_until
  }
  PURCHASE_ORDER {
    uuid id PK
    uuid buyer_id FK
    uuid vendor_id FK
    string state
    string incoterm
    string pay_terms
    bigint total_minor
    string currency
  }
```

## 4. ERD — trust, billing and operations

```mermaid
erDiagram
  PLAN ||--o{ PLAN_ENTITLEMENT : grants
  VENDOR ||--o{ SUBSCRIPTION : holds
  SUBSCRIPTION }o--|| PLAN : on
  SUBSCRIPTION ||--o{ BILLING_EVENT : receives
  SUBSCRIPTION ||--o{ INVOICE : bills
  VENDOR ||--o{ SPONSORED_CAMPAIGN : runs
  USER ||--o{ REPORT : files
  REPORT ||--o| CASE : opens
  CASE ||--o{ CASE_EVIDENCE : holds
  CASE ||--o{ CASE_ACTION : decided_by
  CASE ||--o{ APPEAL : appealed_in
  STAFF_PROFILE }o--o{ ROLE : granted
  ROLE ||--o{ PERMISSION : includes
  STAFF_PROFILE ||--o{ AUDIT_LOG : writes
  AGENT ||--o{ LEAD : owns
  LEAD ||--o{ LEAD_ACTIVITY : logs
  LEAD ||--o| CONSENT : "assisted onboarding needs"
  LEAD ||--o{ AGENT_TASK : generates
  USER ||--o{ NOTIFICATION : receives
  USER ||--o{ NOTIFICATION_PREFERENCE : sets
  NOTIFICATION }o--|| NOTIFICATION_TEMPLATE : from
  CONFIG_ITEM ||--o{ CONFIG_VERSION : versioned_as

  SUBSCRIPTION {
    uuid id PK
    uuid vendor_id FK
    uuid plan_id FK
    string state
    timestamp period_end
    timestamp grace_end
  }
  BILLING_EVENT {
    uuid id PK
    string provider_event_id UK
    string type
    jsonb payload
  }
  CASE {
    uuid id PK
    string severity
    string state
    timestamp sla_due
    uuid linked_booking_id
  }
  AUDIT_LOG {
    uuid id PK
    uuid actor_id
    string action
    string target_type
    uuid target_id
    text reason
    uuid correlation_id
  }
```

## 5. Phase 2 additions (not in MVP schema)

`PAYMENT`, `ESCROW_HOLD`, `PAYOUT`, `COMMISSION_RULE`, `WALLET`, `WALLET_TXN`, `REFUND`, `BANK_ACCOUNT`, `TEAM_MEMBER`, `SAMPLE_REQUEST`, `TRADE_DOCUMENT`, `COUNTRY_PACK`, `CREDIT_NOTE`.

## 6. Key constraints and invariants

| Rule | Mechanism |
|---|---|
| One winning quote per RFQ | `UNIQUE (rfq_id) WHERE state='accepted'` + `SELECT … FOR UPDATE` on RFQ in accept transaction |
| No double-booked slot | Exclusion constraint on `(listing_id, tstzrange(slot_start, slot_end))` where state in (confirmed, in_progress) |
| Idempotent booking create | `UNIQUE (customer_id, idempotency_key)` |
| Idempotent billing webhooks | `UNIQUE (provider_event_id)` |
| Review only after eligible transaction | FK to closed booking/PO/work order + unique per transaction per reviewer |
| Contact details hidden pre-confirmation | Application policy + column-level access; messages scanned |
| Admin self-approval blocked | Check `actor_id <> subject.owner_id` and separation-of-duties rule in service |
| Audit immutability | No UPDATE/DELETE grants on `audit_log` |
| Money precision | `bigint` minor units, `char(3)` currency |

## 7. Index and scale notes

- Search is served by the search index, not Postgres. Keep Postgres indexes for owner lookups (`vendor_id`, `customer_id`, `state`, `created_at`).
- Partition `audit_log`, `message`, `notification`, `booking_event` by month.
- Category attributes in `listing.attributes` (JSONB) with GIN index for admin tooling; filter queries go to the search index.
- Read replicas for dashboards and exports from MVP+3 months.

## 8. Retention

| Data | Retention |
|---|---|
| Audit log, invoices, billing events | 8 years (tax) |
| Messages linked to a case | Until case closed + 2 years |
| Messages otherwise | 2 years after transaction close |
| Verification evidence | While vendor active + 1 year |
| Deleted user PII | Anonymised within 30 days of request unless legal hold |

## Change Log

| Date & time (YYYY-MM-DD HH:MM, local) | Updated by | Change | Reason |
|---|---|---|---|
| 2026-10-29 16:27 | Shil1517 | Modified: added pointer banner | Added pointer to the new docs/ set; content review still outstanding |
