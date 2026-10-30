# Documentation Maintenance Runbook

How to change VendorVerse features and keep the docs, the web mockup and the mobile mockup in step. Follow this for every change, however small. It implements the rule in the repo-root [CLAUDE.md](../CLAUDE.md).

## 1. What is the source of truth

When two things disagree, the higher one wins.

| Rank | Source | Role |
|---|---|---|
| 1 | [04-decisions-log.md](04-decisions-log.md) | Owner decisions (D-xx). Beats everything. |
| 2 | [01-feature-spec.md](01-feature-spec.md) | What each feature is and its phase. |
| 3 | PRS v3.0 (`VendorVerse_Comprehensive_PRS_v3_Global_Marketplace.docx`) | Detailed rules, states, scenarios (SC-xxx), CFG items. Read-only; differences are listed in decisions section 3. |
| 4 | [03-mockup-sync-matrix.md](03-mockup-sync-matrix.md) | Where each feature lives in each mockup. Describes the mockups; does not define scope. |
| 5 | The mockup code (`web/`, `mobile/`) | An illustration of the spec. If it disagrees with ranks 1 to 3, the code is wrong. |
| – | Older docs (`mobile/docs/deliverables/*`, `web/docs/*`, `docs/web-vs-mobile-gap-analysis.md`) | Background and detail. Each carries a pointer to this set. |

[02-phase-scope.md](02-phase-scope.md) is a generated view, not a source.

## 2. Rules

1. **One phase per feature**, set only in the spec. Do not write a phase anywhere else by hand.
2. **IDs are permanent.** Features `F-AAA-nn`, decisions `D-nn`, open decisions `O-nn`, retired screens `RET-nn`. Never reuse or renumber. To remove a feature, strike it through or move its phase, and log it.
3. **Never assume a phase.** If the owner has not decided, the feature's phase is `OPEN`, with an `O-nn` row in the decisions log. Do not build, change or remove anything for it.
4. **Web and mobile move together** (D-013), except admin features, which exist on web only. A change to a Phase 1 feature changes the matrix rows for both platforms in the same change, even if only one app's code is touched first; the other's status or action must say what is outstanding.
5. **Every doc edit gets a Change Log row** (timestamp, author, change, reason) in that doc. Removals state why.
6. **No invented values.** Prices, limits, deadlines and rates stay open (CFG-xx) until the business decides.
7. **The admin portal is web only (D-015).** Never add an `ad_*` screen or an admin role to the mobile app; the checker fails if one appears there.
8. **Run the checker before every commit** that touches `docs/` or either registry (section 6).

## 3. Change procedures

### 3.1 Add a new feature

1. Check the PRS and the spec for an existing row. Do not duplicate.
2. Ask the owner for the phase if it is not given. Use `OPEN` plus a new `O-nn` until answered.
3. Add a row to the right area in the spec with the next free ID. Write the rule, not the screen.
4. Add a row to the sync matrix: web and mobile screens (empty if none), statuses, sync action.
5. Run the checker with `--write`.
6. Add Change Log rows to the spec and the matrix.

### 3.2 Change a feature's rules

1. Edit the description in the spec; cite the PRS section or decision.
2. If the change differs from the PRS, add it to decisions section 3.
3. Update the matrix status or sync action for both platforms.
4. Check the older docs listed in section 5 and fix or add a pointer.

### 3.3 Move a feature between phases

1. Record a new decision (D-nn) with the owner's name and the reason.
2. Change the phase in the spec. If only part moves, split the row into two IDs.
3. Update the "spans phases" table in [02-phase-scope.md](02-phase-scope.md) section 2.
4. Run `--write`. Update any screens that carry a "Phase 2" badge (D-010).
5. Change Log rows in every doc touched, with the reason.

### 3.4 Remove or defer a feature

1. Never delete the row. Move it to a later phase, or strike through the name and say `Removed` with the reason in the description.
2. If screens are retired, add a `RET-nn` row in the matrix with the feature they fold into.
3. Log it in the spec Change Log and the decisions log. The reason is mandatory.

### 3.5 Close an open decision

1. Add a D-nn row; mark the O-nn row `Closed by D-nn`.
2. Update every feature that referenced it: phase, description, matrix status (`Hold` becomes a real status).
3. Update the "Differences from the PRS" table if relevant.

### 3.6 Add, rename or remove a screen in the code

1. Update the registry (`web/src/registry.jsx` or `mobile/src/registry.jsx`).
2. Update the matrix so the screen ID is mapped to a feature or marked retired. The checker fails until it is.
3. If the screen changes behaviour, follow 3.2.
4. Update `mobile/docs/screen-inventory.csv` for mobile screens while that file still exists.

### 3.7 Change the PRS itself

The PRS is the stakeholder document. When it is reissued (O-12), update the decisions section 3 table first, then the spec rows, then the matrix.

## 4. Syncing the mockups to the spec

Do this per feature, in the order Phase 1 first.

1. Open the matrix row. Read the "Sync action" for the app you are changing.
2. Read the feature's rules in the spec and the PRS references.
3. Make the change. Reuse the other app's wording for labels, statuses and tab names (see matrix section 3).
4. Set the status in the matrix to `Done` or `Partial` (with the remaining gap in the action column).
5. Run the checker. Add Change Log rows (matrix, plus the spec if the rules changed).
6. Skip any row whose status is `Hold`.

Suggested order: shared vocabulary and navigation, then bookings and RFQs, then goods, PO and contracts, then business accounts, then subscriptions, then trust and cases, then agent and admin, then Phase 2 badges.

## 5. Older documents

These still hold useful detail but are not the source of truth. Each starts with a pointer to this set. They must be revised when the matching feature changes; until then treat their phase labels as out of date.

| Document | Status |
|---|---|
| `docs/web-vs-mobile-gap-analysis.md` | Snapshot of 2026-10-29 before the sync. Superseded by the sync matrix. |
| `web/docs/GAP_REPORT.md`, `web/docs/requirements-coverage.md` | Web audit of 24 Oct 2026 against the PRS. Phase and scope superseded by the spec. |
| `mobile/docs/deliverables/01-feature-coverage-gap-analysis.md`, `02-screen-wise-status.md`, `08-mvp-and-phase2-scope.md` | Superseded by the spec, sync matrix and phase scope. |
| `mobile/docs/deliverables/03` to `07`, `09`, `10`, `mobile/docs/user-flows-and-roadmap.md` | Detail docs (taxonomy, flows, states, ERD, API, timeline, acceptance). Not yet reviewed against D-002 to D-013. Review is outstanding. |
| `mobile/docs/screen-inventory.csv` | Mobile screen list with MVP / P2 tags. Regenerated on 2026-10-29 from the registry (132 screens, no admin); the matrix replaces it. |
| `docs/VendorVerse_Mockup_Priority_Review.docx` | Stakeholder priorities. Its journeys and workflow states feed F-MCK-01 and the state tables. |

## 6. The checker

```
python docs/tools/check_docs.py            # check
python docs/tools/check_docs.py --write    # check and regenerate the phase lists in 02-phase-scope.md
```

It fails if:

- a feature ID is duplicated, has an invalid phase, or exists in only one of spec or matrix;
- the matrix names a screen that is not in the web or mobile registry;
- the mobile registry contains an `ad_*` (admin) screen, or a retired `RET-xx` screen is back in the web registry;
- a registry screen is not mapped to a feature (or retired);
- a status is not one of Done, Partial, Missing, Hold, Unverified, N/A.

It does not check that the statuses are true. Re-verify a status whenever you touch the screen.

## 7. Change Log format

At the bottom of every doc:

```
| Date & time (YYYY-MM-DD HH:MM, local) | Updated by | Change | Reason |
|---|---|---|---|
| 2026-10-29 17:21 | Shil1517 | Modified: rule 7 (admin portal is web only), checker description, screen-inventory note | D-015 and the checker now enforce that mobile has no admin screens. |
| 2026-10-29 16:40 | Shil1517 | Modified: F-PAY-02 Mode B moved to Phase 1 | Owner decision D-002 |
```

- Newest first.
- "Updated by" is the person making the change, not the tool that typed it.
- Change starts with `Added`, `Modified` or `Removed`.

## 8. Review checklist (copy into the PR)

- [ ] Feature spec updated, one phase per row, no reused IDs
- [ ] Matrix updated for both platforms
- [ ] Decision logged (D-nn) for any scope or phase change, or an O-nn opened
- [ ] No phase assumed; OPEN rows untouched
- [ ] Differences from the PRS recorded
- [ ] Change Log row in every doc touched, with a reason
- [ ] `python docs/tools/check_docs.py --write` passes
- [ ] Older docs listed in section 5 checked or pointed here

## Change Log

| Date & time (YYYY-MM-DD HH:MM, local) | Updated by | Change | Reason |
|---|---|---|---|
| 2026-10-29 16:27 | Shil1517 | Added: maintenance runbook | The mockups drifted through frequent unlogged changes; a fixed procedure and a checker keep docs, web and mobile aligned. |
