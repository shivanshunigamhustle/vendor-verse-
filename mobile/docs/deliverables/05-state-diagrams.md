# 05 · Booking, RFQ and Order State Diagrams

> **Detail document, not yet reviewed against the 2026-10-29 decisions** (see [../../../docs/04-decisions-log.md](../../../docs/04-decisions-log.md)). Phase labels follow the spec in [../../../docs/01-feature-spec.md](../../../docs/01-feature-spec.md) where they differ.


States come from the mockup code (`BK_LABEL` in `src/screens/shared.jsx`, `PO_FLOW`/`rfqStatus` in `src/mvpdata.jsx`). Items marked **(proposed)** are not yet in the mockup and are needed for production.

## 1. Booking

```mermaid
stateDiagram-v2
  [*] --> Draft
  Draft --> Requested: customer submits (idempotent, slot check)
  Requested --> Confirmed: vendor accepts
  Requested --> Declined: vendor declines
  Requested --> Expired: response deadline passes
  Requested --> Cancelled: customer withdraws
  Confirmed --> ModificationRequested: either side proposes change
  ModificationRequested --> Confirmed: accepted (new terms) or declined (original stays)
  Confirmed --> InProgress: service starts
  Confirmed --> Cancelled: cancel — policy result applied
  Confirmed --> VendorCancelled: vendor cancels (recorded, no auto-penalty)
  InProgress --> AwaitingConfirmation: vendor marks complete
  AwaitingConfirmation --> Closed: customer confirms
  AwaitingConfirmation --> Closed: 7 days pass (auto-close)
  AwaitingConfirmation --> Disputed: customer reports issue
  Disputed --> Closed: case resolved
  Declined --> [*]
  Expired --> [*]
  Cancelled --> [*]
  VendorCancelled --> [*]
  Closed --> [*]
```

**Rules**
- Terms are snapshotted at confirmation. A modification never changes them until accepted.
- Two simultaneous confirmations for one slot → "conflicting confirmations" chooser; one wins atomically.
- Instant booking skips *Requested*: slot is locked and the booking is created as *Confirmed* with an ETA.
- Reviews are enabled only from *Closed* with a completed transaction.
- A support case can be linked to a closed booking.

## 2. RFQ

```mermaid
stateDiagram-v2
  [*] --> Draft
  Draft --> Submitted: customer submits (attachments scanned)
  Submitted --> SentToVendors: eligible recipients matched
  SentToVendors --> QuotesReceived: first quote arrives
  SentToVendors --> NoQuotes: deadline passes with no quote
  NoQuotes --> SentToVendors: extend deadline / widen recipients
  QuotesReceived --> Negotiating: customer asks a question or counter
  Negotiating --> QuotesReceived: vendor revises quote
  QuotesReceived --> Accepted: customer accepts one quote (atomic)
  Negotiating --> Accepted: customer accepts one quote (atomic)
  SentToVendors --> Revised: customer edits RFQ
  QuotesReceived --> Revised: customer edits RFQ
  Revised --> SentToVendors: new revision notified
  Draft --> Cancelled
  SentToVendors --> Withdrawn: customer withdraws
  QuotesReceived --> Withdrawn
  QuotesReceived --> Expired: validity ends
  Accepted --> [*]
  NoQuotes --> [*]
  Withdrawn --> [*]
  Expired --> [*]
  Cancelled --> [*]
```

**Quote sub-states:** `submitted → revised → withdrawn | expired | accepted | not_selected`.

**Rules**
- Accept is atomic: if two accepts race, exactly one wins; the others receive "not selected".
- Accepting creates an immutable **accepted-terms snapshot** plus a downstream record:
  - service RFQ → **work order** (or booking),
  - goods RFQ → **purchase order**,
  - recurring/project → **contract**.
- Editing an RFQ creates a revision; vendors with open quotes are notified and may revise.

## 3. Purchase order (goods)

```mermaid
stateDiagram-v2
  [*] --> Created: from accepted quote or catalogue
  Created --> Accepted: supplier accepts
  Created --> Rejected: supplier rejects
  Created --> Cancelled: buyer cancels before acceptance
  Accepted --> PaymentConfirmed: advance / terms confirmed (direct to supplier)
  Accepted --> PaymentFailed: advance declined
  PaymentFailed --> PaymentConfirmed: retry within window
  PaymentFailed --> Cancelled: window lapses
  PaymentConfirmed --> Processing
  Processing --> Shipped: AWB / tracking added
  Shipped --> Delivered
  Shipped --> Exception: damage, delay, partial
  Exception --> Delivered: resolved (re-ship / partial accept)
  Exception --> Disputed
  Delivered --> Completed: buyer confirms
  Delivered --> Disputed: buyer rejects goods
  Disputed --> Completed: outcome applied (replace / credit note / partial refund) (proposed)
  Rejected --> [*]
  Cancelled --> [*]
  Completed --> [*]
```

## 4. Contract (recurring, AMC, supply, project)

```mermaid
stateDiagram-v2
  [*] --> Proposed: customer proposes
  Proposed --> Countered: vendor counters
  Countered --> Proposed: customer counters back
  Proposed --> PendingSignatures: terms agreed
  PendingSignatures --> Active: both e-sign
  Proposed --> Declined
  Active --> MilestoneDue
  MilestoneDue --> Active: milestone / visit completed and paid
  Active --> Amended: change agreed (proposed)
  Amended --> Active
  Active --> Renewed: before term end (proposed)
  Active --> Terminated: notice served (proposed)
  Active --> Completed: all milestones done
  Declined --> [*]
  Terminated --> [*]
  Completed --> [*]
```

## 5. Vendor verification and listing publication

```mermaid
stateDiagram-v2
  [*] --> NotSubmitted
  NotSubmitted --> Pending: evidence submitted
  Pending --> NeedsInfo: reviewer requests more
  NeedsInfo --> Pending: vendor resubmits
  Pending --> Verified: approved (tier 1-3)
  Pending --> Rejected: reason recorded
  Verified --> Expiring: credential nears expiry
  Expiring --> Verified: renewed
  Expiring --> Lapsed: expiry passes
  Lapsed --> Pending: new evidence
  Rejected --> Pending: appeal / resubmit
```

A listing is **public only if all six gates pass**, computed live: account state · content review · subscription (active/grace/cancelled-in-period) · required verification (per-credential expiry) · required fields + service area · no holds.

## 6. Subscription

```mermaid
stateDiagram-v2
  [*] --> Active: paid
  Active --> Grace: renewal fails (3 days)
  Grace --> Active: payment recovered
  Grace --> Expired: grace ends
  Active --> CancelledInPeriod: vendor cancels
  CancelledInPeriod --> Expired: period ends
  Expired --> Active: re-subscribe
```

## 7. Support case

```mermaid
stateDiagram-v2
  [*] --> Open: report filed
  Open --> Triaged: severity + SLA set
  Triaged --> InReview
  InReview --> EmergencyRestricted: severe risk (post-review required)
  InReview --> Decided
  EmergencyRestricted --> Decided
  Decided --> Appealed: vendor appeals
  Appealed --> Decided: human re-review
  Decided --> Closed
```

## Change Log

| Date & time (YYYY-MM-DD HH:MM, local) | Updated by | Change | Reason |
|---|---|---|---|
| 2026-10-29 16:27 | Shil1517 | Modified: added pointer banner | Added pointer to the new docs/ set; content review still outstanding |
