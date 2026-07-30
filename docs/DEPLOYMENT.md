# Deployment Guide

This guide deploys the Capstone G1 Shop frontend. The backend is a separate
service and is not built or deployed from this repository.

## Deployment Overview

| Setting | Value |
| --- | --- |
| Application type | Vite single-page frontend |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Build output | `dist` |
| Required runtime secrets | None in the current implementation |
| Current API | `https://capstone-project-backend-delta.vercel.app/api` |

Vite produces static assets in `dist/`, so the frontend can be hosted by Vercel
or any static web server.

## 1. Pre-deployment Checks

Use a Node.js version supported by Vite 8: `20.19+` or `22.12+`.

From the repository root, run:

```bash
node --version
npm ci
npm run lint
npm run build
npm run preview
```

Open the URL printed by `npm run preview`, normally
`http://localhost:4173`, and complete the smoke test below.

### Smoke Test

- The home page loads without console errors.
- Products and categories load from the backend.
- A product can be added to, updated in, and removed from the cart.
- Guest checkout creates an order and displays its confirmation.
- The generated guest order code can be retrieved through Track Order.
- A newly registered account can sign out and sign in again on the same browser.
- A registered customer can open My Orders.
- Language and theme selection persist after a refresh.
- Product images load, or the fallback image appears.

Do not deploy if the build fails or the core API-backed flows cannot reach the
backend.

## 2. Deploy with Vercel Git Integration

This is the simplest team workflow.

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, select **Add New → Project** and import the repository.
3. Confirm these project settings:

   | Field | Value |
   | --- | --- |
   | Framework preset | Vite |
   | Root directory | Repository root |
   | Install command | `npm ci` |
   | Build command | `npm run build` |
   | Output directory | `dist` |

4. No frontend environment variables are required for the current code.
5. Select **Deploy**.
6. When the deployment is ready, repeat the smoke test against its preview URL.
7. Promote the verified deployment or merge the branch used for production.

With Vercel Git integration, pushes to non-production branches create preview
deployments and pushes to the configured production branch create production
deployments.

## 3. Deploy with the Vercel CLI

Install and authenticate the CLI:

```bash
npm install --global vercel
vercel login
```

Create a preview deployment from the repository root:

```bash
vercel
```

After validating the preview, deploy to production:

```bash
vercel --prod
```

Useful operational commands:

```bash
vercel ls
vercel inspect <deployment-url>
vercel logs <deployment-url>
```

For custom CI, use Vercel's prebuilt workflow and keep the token and project IDs
in the CI provider's secret store:

```bash
vercel pull --yes --environment=production --token="$VERCEL_TOKEN"
vercel build --prod --token="$VERCEL_TOKEN"
vercel deploy --prebuilt --prod --token="$VERCEL_TOKEN"
```

Custom CI requires `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and
`VERCEL_PROJECT_ID`. Never commit these values.

## 4. Deploy to Another Static Host

Build the project:

```bash
npm ci
npm run build
```

Upload the contents of `dist/` to the host's public directory. Configure the
host to:

- serve `index.html` at the site root;
- use HTTPS;
- serve fingerprinted assets with long-lived cache headers;
- serve `index.html` with revalidation or a short cache duration.

The application does not currently use URL-based client routes, so a rewrite
rule is not required for its current navigation model. If React Router or
history-based routes are added later, configure unknown paths to fall back to
`/index.html`.

## 5. Backend and CORS Requirements

The deployed frontend must be able to call:

`https://capstone-project-backend-delta.vercel.app/api`

The backend must:

- be available over HTTPS;
- allow the frontend production and preview origins through CORS;
- allow the HTTP methods and headers used by the frontend, including
  `Content-Type` and `Authorization`;
- expose the products, categories, users, carts, cart-items, orders, and
  order-items resources;
- return JSON response shapes compatible with the normalization code in
  `src/api/`.

If a deployment loads but shows no catalog data, check the browser Network tab
for a failed API request. A CORS error must be corrected in the backend's
allowed-origin configuration; it cannot be fixed by the static frontend host.

## 6. Using a Different Backend

The repository does not yet read the API URL from an environment variable.
Before building, replace the `API_BASE_URL` value in every file under
`src/api/`:

```js
const API_BASE_URL = "https://your-backend.example.com/api";
```

Search for all current definitions:

```bash
rg 'const API_BASE_URL' src/api
```

Then run the lint, build, preview, and smoke-test steps again. Because Vite
bundles these values into the browser assets at build time, changing the URL
requires a new frontend build and deployment.

A recommended future improvement is to define the URL once using a
`VITE_API_BASE_URL` environment variable. Remember that every `VITE_` value is
included in client-side code and must never contain a secret.

## 7. Release and Rollback

For each release:

1. Run lint and build locally.
2. Create a preview deployment.
3. Run the smoke test on the preview.
4. Promote the same verified build to production.
5. Record the deployed commit and URL.

To roll back in Vercel:

```bash
vercel rollback
```

Or target a known deployment:

```bash
vercel rollback <deployment-url-or-id>
```

After a rollback, repeat the catalog, cart, and checkout checks. A frontend
rollback does not roll back backend data or schema changes.

## Troubleshooting

### Build fails because of Node.js

Use Node.js `20.19+` or `22.12+`, reinstall with `npm ci`, and build again.

### Products or categories do not load

Confirm the hosted API is available, then inspect the browser Network tab.
Typical causes are an API outage, a changed response format, or missing CORS
permission for the new frontend origin.

### Login says the account cannot be verified on this device

This is expected for an account that was not registered in the same browser.
The current backend has no login endpoint, so a production-quality fix requires
server-side authentication rather than a deployment setting.

### Refresh returns to the home page

This is current application behavior because navigation is stored in React
state. It is not a static-host routing failure.

### The interface works but payment is not charged

The payment selector is demonstrational. No payment gateway is integrated and
no card data is processed.

## References

- [Vite static deployment guide](https://vite.dev/guide/static-deploy.html)
- [Vercel deployments](https://vercel.com/docs/deployments)
- [Vercel CLI](https://vercel.com/docs/cli)
- [npm clean install](https://docs.npmjs.com/cli/commands/npm-ci)
