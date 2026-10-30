# VendorVerse Web

Responsive web client of VendorVerse. It shows **the same screens, data and rules as the mobile app** (`../mobile`) inside a desktop shell (top navigation, screen directory, content column), and adds the **admin portal, which exists on web only** (decision D-015, sidebar navigation, 34 screens). Which screen implements which feature on each app is in [`../docs/03-mockup-sync-matrix.md`](../docs/03-mockup-sync-matrix.md).

This is a front-end mockup. Data is in memory and resets on reload; there is no backend or real authentication. Demo OTP `123456`; admin authenticator code `654321`.

## Run

```bash
cd web
npm install
npm run dev
npm run build
```

Deep links: `/#/c_home`, `/#/v_dash`, `/#/ad_dash` …

## Structure

`src/App.jsx` is the only web-specific UI (header, sidebar, drawer). `src/screens/*`, `src/data.jsx`, `src/store.jsx`, `src/ui.jsx` and the other `src/*` modules are the shared mockup code, kept identical to `mobile/src`. The admin-only files are `screens/admin_a.jsx` to `admin_d.jsx` and `screens/catbuilder.jsx`; they are not in the mobile app.

## Docker

```bash
cd web
docker build -t vendorverse-web .
docker run --rm -p 8080:80 vendorverse-web
```

Then open http://localhost:8080. The image builds the Vite app and serves it with nginx.

## Change Log

| Date & time (YYYY-MM-DD HH:MM, local) | Updated by | Change | Reason |
|---|---|---|---|
| 2026-10-30 11:30 | Shil1517 | Added: Dockerfile, nginx.conf and .dockerignore for the web app; Docker run section | Owner asked for an individual Docker setup per app. |
| 2026-10-29 17:21 | Shil1517 | Modified: web now runs the mobile screens and data; admin portal documented as web only | Mockup sync of web to mobile (D-013) and admin portal on web only (D-015). |
