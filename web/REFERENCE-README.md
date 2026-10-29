# VendorVerse — Mobile Mockup

Interactive mobile mockup of the **VendorVerse Software Requirements Specification v1.0** (ADRSTECHNO PRIVATE LIMITED).
React 19 + Vite + Tailwind CSS v4. No backend — all data is mock data held in memory.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Product model
Customers **do not buy or pay in the app**. They discover verified vendors, products and services, then **talk to the vendor in one Messages section** (enquiries, quotes, files) and agree the deal directly. Requests for quotation (RFQ) remain as a way to collect quotes.
Order, booking, checkout, payment, refund, inventory and payout screens were removed.

## What is in it (64 screens)
* **Customer:** home, categories, search + filters, listing and vendor pages, saved/compare, **Messages + chat**, RFQ create/compare/accept, reviews, issue reporting, profile, settings & privacy.
* **Vendor:** dashboard, registration wizard, verification status/resubmit, listings, **Messages + chat**, quote requests, reviews, performance, business profile.
* **Sales agent:** pipeline, leads, activity log, follow-ups, assisted onboarding (consent), commissions.
* **Super admin:** dashboard, vendor verification, listing moderation, users & roles, categories & required fields, agents & commission approval, disputes/reports, reports + export, platform settings, audit log.

Left panel (desktop) = role switcher + screen directory. Right panel (wide desktop) = SRS text for the current screen.
Deep links: `/#/messages`, `/#/c_listing`, `/#/ad_vendor`… Demo OTP `123456` · admin authenticator `654321`.

## Messages
One section for both roles: conversation list (search, unread, quote requests), enquiry context card for the listing, attachments, quick replies, verified badge, simulated reply, and chat menu (view vendor, request quote, rate vendor, report).

## Structure
`src/ui.jsx` design kit · `src/store.jsx` shared state · `src/data.jsx` mock data · `src/registry.jsx` screen map · `src/screens/*` screens · `src/specs.js` SRS content.
