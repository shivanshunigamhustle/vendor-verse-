# VendorVerse Website Mockup

Separate responsive marketplace website inspired by the VendorVerse reference app in `VendorVerse-main/`.

The landing page is redesigned as a marketplace website with searchable products and services, category browsing, featured verified vendors, saved listings, quote requests, messages, and account entry points. The role-specific customer, vendor, sales agent, and admin workflows remain based on the reference app. Users choose a role on the sign-in screen; OTP verification then opens that role’s workspace. Main navigation follows the signed-in role, while secondary pages are in the “More pages” menu. Mobile navigation adapts to a compact layout.

This is a front-end mockup. Data is in memory and resets on reload; there is no backend or real authentication.

## Run

From this folder:

```bash
npm install
npm run dev
npm run build
```

The `src/` modules are based on the reference app; `src/App.jsx` provides the website shell while retaining the shared screen implementations and workflows.
