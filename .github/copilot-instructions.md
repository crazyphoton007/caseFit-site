# GitHub Copilot Instructions for caseFit-site

- This repository is a static landing page deployed from `src/casefit`, not a normal React app build pipeline.
- `package.json` contains React and TypeScript dependencies, but the live deploy does not use a React source tree. The real published assets are static files in `src/casefit`.
- `package.json` scripts are custom:
  - `npm start` runs `node scripts/serve-static.js` to serve `src/casefit` locally.
  - `npm run build` and `npm test` both run `node scripts/verify-static-site.js` to validate required static assets and HTML markers.
- The root `public/` directory is a leftover Create React App scaffold and should not be edited for the deployed site unless the user explicitly asks.

## Key files to edit
- `src/casefit/index.html`: actual page markup, inline CSS, inline client-side behavior, Netlify form markup, and thank-you redirect handling.
- `src/casefit/_redirects`: Netlify redirect rule used by the static deploy.
- `src/casefit/site.webmanifest`: PWA manifest referenced by `index.html`.
- `netlify.toml`: deploy publish path, empty build command, and HTTP header/CSP rules.
- `scripts/serve-static.js`: local server behavior and SPA-style fallback to `index.html`.
- `scripts/verify-static-site.js`: build/test verification expectations.
## Important conventions
- Preserve the Netlify form marker and redirect flow in `src/casefit/index.html`:
  - hidden input `name="form-name" value="register"`
  - `data-netlify-recaptcha="true"`
  - `id="registeredThanks"`
- Keep asset references stable for verification:
  - `/favicon-32.png?v=4`
  - `/site.webmanifest?v=4`
- The verification script expects these publish assets:
  - `_redirects`, `casefit-wordmark-white.png`, `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `favicon-64.png`, `apple-touch-icon.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`, `site.webmanifest`.

## What to avoid
- Do not assume `react-scripts`, `TypeScript`, or `public/index.html` are used by the live deploy.
- Do not change `netlify.toml` publish path without also updating the site structure and verification script.

## Developer workflow
- `npm install` to refresh Node dependencies.
- `npm start` to preview the static site from `src/casefit` on `http://127.0.0.1:3000`.
- `npm run build` / `npm test` to run static-site verification only.

If anything in this summary is unclear or missing, ask for the specific part of the site or workflow to refine further.