# Capstone G1 Shop

Capstone G1 Shop is a multilingual e-commerce storefront built with React and
Vite. It supports product browsing, category filtering, guest and registered
customer carts, checkout, order confirmation, guest order tracking, and a
customer order dashboard.

The frontend currently connects to the hosted REST API at:

`https://capstone-project-backend-delta.vercel.app/api`

## Features

- Browse products and filter them by category
- View product details and manage cart quantities
- Use a server-backed cart as a guest or registered customer
- Register and sign in on the same browser/device
- Place guest or registered-customer orders
- Track a guest order by its order code
- Review previous orders from the customer dashboard
- Switch between English, Chinese, Malay, and Tamil
- Use light or dark appearance based on preference
- Fall back to a placeholder when a product image is unavailable

## Technology

| Area | Technology |
| --- | --- |
| UI | React 19 |
| Build tooling | Vite 8 |
| Styling | Plain CSS |
| Localization | i18next and react-i18next |
| Password hashing | bcryptjs |
| Data access | Browser Fetch API |
| State | React Context and browser local storage |

## Prerequisites

- Node.js `20.19+` or `22.12+`
- npm (included with Node.js)
- Network access to the hosted backend API

The Node.js requirement comes from the version of Vite used by this project.

## Getting Started

1. Clone the repository and enter the project directory.

   ```bash
   git clone <repository-url>
   cd capstone-project-groupone
   ```

2. Install the locked dependency versions.

   ```bash
   npm ci
   ```

3. Start the development server.

   ```bash
   npm run dev
   ```

4. Open the local URL printed by Vite, normally
   `http://localhost:5173`.

No `.env` file is required in the current version because the backend URL is
defined directly in each file under `src/api/`.

## Available Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot reload |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run preview` | Serve the production build locally for verification |
| `npm run lint` | Check JavaScript and JSX with ESLint |

## Project Structure

```text
.
├── public/                 # Static icons and favicon
├── src/
│   ├── api/                # REST API request modules
│   ├── assets/             # Imported image assets
│   ├── component/          # Reusable UI components
│   ├── context/            # Authentication, cart, and theme state
│   ├── i18n/               # Language setup and translations
│   ├── pages/              # Storefront page components
│   ├── utils/              # Product image helper
│   ├── App.jsx             # Page selection and application shell
│   └── main.jsx            # React providers and entry point
├── docs/
│   ├── DEPLOYMENT.md       # Production deployment instructions
│   └── TEST_CASES.md       # Manual functional and non-functional tests
├── index.html
├── package.json
└── vite.config.js
```

## Application Design

`main.jsx` wraps the application in theme, authentication, and cart providers.
`App.jsx` manages page navigation in React state rather than using a routing
library. The page components call the API modules, which communicate with the
separately deployed backend.

The backend resources used by this frontend are:

- `/products`
- `/categories`
- `/users`
- `/carts`
- `/cart-items`
- `/orders`
- `/order-items`

Browser local storage is used for the selected theme and language, the current
user session, the guest cart session token, a cart fallback, and locally stored
password verification data.

## Localization

Translation files are located in `src/i18n/`:

| Code | Language |
| --- | --- |
| `en` | English |
| `zh` | Chinese |
| `ms` | Malay |
| `ta` | Tamil |

Add a translation by creating its resource file, registering it in
`src/i18n/index.js`, and adding it to `supportedLanguages`.

## Current Limitations

- The API base URL is hard-coded in every API module. Changing backends requires
  updating the `API_BASE_URL` constants and rebuilding the frontend.
- The backend does not currently expose a login endpoint. Registration stores a
  password hash in the current browser, and login can only verify an account
  registered on that same browser/device.
- Generated customer tokens are frontend identifiers rather than proof of
  server-authenticated sessions.
- Checkout displays payment-method choices but does not collect card details,
  contact a payment gateway, or process a real payment.
- Guest order lookup fetches orders and filters them in the browser. Production
  systems should expose a restricted lookup endpoint instead of returning all
  orders.
- Navigation is held in memory. Refreshing the browser returns to the home page.
- Automated unit and end-to-end test scripts have not been configured.

These limitations make the current application appropriate for a capstone or
demonstration environment. Implement server-side authentication, authorization,
restricted order lookup, environment-based API configuration, and a payment
provider before handling real customer or payment data.

## Deployment

See the [Deployment Guide](docs/DEPLOYMENT.md) for local build verification,
Vercel deployment, generic static-host deployment, backend/CORS requirements,
rollback, and troubleshooting.

See [Test Cases](docs/TEST_CASES.md) for the manual acceptance suite, test data,
execution template, and known limitation checks.

## Contributing

1. Create a feature branch.
2. Make a focused change.
3. Run `npm run lint` and `npm run build`.
4. Verify the affected customer flow locally.
5. Open a pull request describing the change and test results.

## License

No license file is currently included. Add a license before distributing or
reusing the project outside its intended course or team context.
