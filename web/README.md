# VendorVerse Website Mockup

Separate responsive marketplace website inspired by the VendorVerse reference app in `VendorVerse-main/`.

The landing page is redesigned as a marketplace website with searchable products and services, category browsing, featured verified vendors, saved listings, quote requests, messages, and account entry points. The role-specific customer, vendor, sales agent, and admin workflows remain based on the reference app. Users choose a role on the sign-in screen; OTP verification then opens that role’s workspace. Main navigation follows the signed-in role, while secondary pages are in the “More pages” menu. Mobile navigation adapts to a compact layout.

This is a front-end mockup. Data is in memory and resets on reload; there is no backend or real authentication.

## Run

From this folder:

```bash
cd web
npm install
npm run dev
npm run build
```

The `src/` modules are based on the reference app; `src/App.jsx` provides the website shell while retaining the shared screen implementations and workflows.

## Sync status (2026-10-30)

The web mockup follows `docs/01-feature-spec.md` and `docs/03-mockup-sync-matrix.md`. It has 178 registered screens: the Phase 1 sync screens live in `src/screens/p1-*.jsx`, and Phase 2 previews carry a "Phase 2" badge. Demo sign-in: OTP `123456` for every role, asked once (including Super Admin). Plan names are Free, Starter, Growth and Pro with sample values and no prices (D-007). Saved browser data from earlier versions is ignored (storage key `vendorverse.website.state.v3`).

## Change Log

| Date & time (YYYY-MM-DD HH:MM, local) | Updated by | Change | Reason |
|---|---|---|---|
| 2026-10-31 10:37 | Shil1517 | Modified: Business account and RFQ form notes | Business is selectable at sign-up and runs eligibility, six-step company form and admin verification. Phase 2 features carry a badge. |
| 2026-10-30 17:34 | Shil1517 | Modified: admin signs in with the single OTP | Owner request 2026-10-30; removes the 654321 second step on web. |
| 2026-10-30 17:31 | Shil1517 | Modified: noted browser-verified flows and URL navigation | Hash links and back/forward now navigate; vendor sign-up passes through the type chooser. No backend: all data stays in localStorage. |
| 2026-10-30 17:05 | Shil1517 | Modified: screen count, storefront and picker notes | Second web sync pass (company storefront as Phase 2, mobile-style location picker). |
| 2026-10-30 16:42 | Shil1517 | Added: sync status section | Describes the web screens, demo OTPs and plan placeholders after the 2026-10-30 sync pass. |
