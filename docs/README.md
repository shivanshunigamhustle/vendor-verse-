# VendorVerse Documentation

One product, two mockups (web and mobile), one feature set. The admin portal is web only (D-015). These files are the source of truth for scope, phase and mockup sync.

| # | File | Use it to |
|---|---|---|
| 1 | [01-feature-spec.md](01-feature-spec.md) | Find what a feature is and which phase it is in. |
| 2 | [02-phase-scope.md](02-phase-scope.md) | See Phase 1, 2 and 3 side by side and where features span phases. |
| 3 | [03-mockup-sync-matrix.md](03-mockup-sync-matrix.md) | See what each mockup has and what to change to match. |
| 4 | [04-decisions-log.md](04-decisions-log.md) | See who decided what, open questions, and differences from the PRS. |
| 5 | [05-maintenance-runbook.md](05-maintenance-runbook.md) | Change anything: procedures, rules, checklist. |
| – | [tools/check_docs.py](tools/check_docs.py) | Verify the docs agree with each other and with both screen registries. |

Other files in `docs/`:

- `VendorVerse_Comprehensive_PRS_v3_Global_Marketplace.docx`: the stakeholder PRS, dated 24 Oct 2026. Read-only; differences are in decisions section 3.
- `VendorVerse_Mockup_Priority_Review.docx`: what the mockup must demonstrate.
- `web-vs-mobile-gap-analysis.md`: snapshot before the sync (superseded).

Repo rule (from [CLAUDE.md](../CLAUDE.md)): any change to a feature updates these docs in the same commit, with a Change Log row giving the date and time, who changed it and why.

## Change Log

| Date & time (YYYY-MM-DD HH:MM, local) | Updated by | Change | Reason |
|---|---|---|---|
| 2026-10-29 17:21 | Shil1517 | Modified: intro line (admin portal is web only) | D-015. |
| 2026-10-29 16:27 | Shil1517 | Added: docs index | Entry point for the new documentation set. |
