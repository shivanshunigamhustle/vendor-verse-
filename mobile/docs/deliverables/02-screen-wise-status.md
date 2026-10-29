# 02 · Screen-Wise Status — Completed / Partial / Missing / Future

> **Superseded (2026-10-29).** Scope, phases and mockup status now live in [../../../docs/01-feature-spec.md](../../../docs/01-feature-spec.md), [../../../docs/03-mockup-sync-matrix.md](../../../docs/03-mockup-sync-matrix.md) and [../../../docs/04-decisions-log.md](../../../docs/04-decisions-log.md). Kept for background; phase labels and counts below may be out of date.


_Source: `docs/screen-inventory.csv` (156 screens) plus gaps from doc 01._

**Status meaning**
- **Completed** — clickable in the mobile mockup with its business rule evaluated. Needs real backend.
- **Partial** — mockup exists but a sub-flow, state or rule is absent.
- **Missing** — required by the spec, no screen yet.
- **Future** — deliberately Phase 2/3.

## 1. Totals

| Status | Screens |
|---|---|
| Completed | 141 |
| Partial | 5 |
| Future (Phase 2 mocked) | 10 |
| Missing (new screens needed) | 22 (listed in §4) |

## 2. Per-role breakdown (inventory)

| Role | MVP | Phase 2 | Total |
|---|---|---|---|
| Auth | 5 | 0 | 5 |
| Shared | 11 | 0 | 11 |
| Customer (incl. buyer mode) | 51 | 7 | 58 |
| Vendor | 31 | 2 | 33 |
| Business | 7 | 0 | 7 |
| Agent | 11 | 0 | 11 |
| Admin | 30 | 1 | 31 |
| **Total** | **146** | **10** | **156** |

## 3. Non-completed screens in the inventory

### Partial
| Screen | ID | What is missing |
|---|---|---|
| Contract — terms, e-sign, milestones | `c_contract`, `v_contract` | Renewal, amendment, termination, missed-milestone |
| Chat — linked, private | `chat` | Attachments rule, delivery state, block/mute |
| Notifications | `notifications` | Per-channel preferences, templates |
| Analytics | `ad_analytics` | Static sample data; no export or date ranges |
| Purchase order — delivery exception | `c_order_exc` | Settlement outcomes (replace / credit / refund) |

### Future (Phase 2 — mocked but not in MVP navigation)
`c_pay`, `c_payments`, `c_pay_fx`, `c_refund`, `c_refund_view`, `c_wallet`, `v_payouts`, `v_refunds`, `team`, `ad_commission`

## 4. Missing screens (to add)

| # | Screen | Role | Phase | Reason |
|---|---|---|---|---|
| 1 | Notification preferences (channel × event matrix) | All | MVP | G5 |
| 2 | Email/SMS/push template manager | Admin | MVP | G5 |
| 3 | Contract renewal / amend / terminate | Customer, Vendor | P2 | G8 |
| 4 | PO dispute resolution (outcome picker) | Customer, Vendor, Admin | MVP | G7 |
| 5 | Credit note view | Customer, Vendor | P2 | G7 |
| 6 | Data export / "download my data" | Customer, Vendor | MVP | G13 |
| 7 | Deletion confirmation with retention explainer | All | MVP | G13 |
| 8 | Analytics date range + export | Admin | MVP | |
| 9 | Event/tracking debug view | Admin | P2 | G16 |
| 10 | Staff helpdesk macros and SLA timers | Admin | P2 | G11 |
| 11 | Image/text moderation review queue | Admin | MVP | G12 |
| 12 | Forced app update / maintenance screen | Shared | MVP | Ops |
| 13 | Permission prompts (location, notifications, camera) explainer | Shared | MVP | Store review |
| 14 | Session/device list with revoke (vendor and admin) | Vendor, Admin | MVP | Security |
| 15 | Feature flags console | Admin | P2 | G4 |
| 16 | Tier 4 audit scheduling | Admin, Vendor | P2 | |
| 17 | Sample request (manufacturer) | Customer, Vendor | P2 | Global sourcing |
| 18 | Trade-document vault | Vendor, Customer | P2 | Global sourcing |
| 19 | Arabic/RTL review of key screens | All | P2 | |
| 20 | Language selection beyond EN/HI | All | P2 | |
| 21 | Vendor staff accounts | Vendor | P2 | |
| 22 | Enterprise approvals / cost centres | Customer | P3 | |

## 5. Phase 3 (not planned in screens yet)

Personalised home, AI search, ML category mapping, fraud-signal ML, trade finance, BNPL, freight bundles, multi-vendor tenders, offline field tools, predictive demand.

## 6. Platform scope

Mobile only (Android + iOS). Web is a separate workstream and not tracked here.

## Change Log

| Date & time (YYYY-MM-DD HH:MM, local) | Updated by | Change | Reason |
|---|---|---|---|
| 2026-10-29 16:27 | Shil1517 | Modified: added pointer banner | Marked superseded by the new docs/ set (owner decisions D-001 to D-014) |
