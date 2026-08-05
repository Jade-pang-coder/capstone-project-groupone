# Final Project Report

## Capstone G1 Shop — Multilingual E-Commerce Storefront

**Team:** Weijie, Shukla, and Jade  
**Project start:** 21 July 2026  
**Report revision:** 5 August 2026  
**Repository:** [Jade-pang-coder/capstone-project-groupone](https://github.com/Jade-pang-coder/capstone-project-groupone)  
**Backend API:** [https://capstone-project-backend-delta.vercel.app/api](https://capstone-project-backend-delta.vercel.app/api)

---

## Executive Summary

Capstone G1 Shop is a responsive e-commerce storefront developed with React 19 and Vite 8. The application lets visitors browse and search a product catalogue, filter products by category, view product details, manage a cart, and complete checkout as either a guest or a registered customer. Registered customers can sign in and review their previous orders. Guests can retain and retrieve recent order information on the same browser by using an order code.

The interface supports English, Simplified Chinese, Malay, and Tamil. It also provides light and dark themes, responsive page layouts, loading and error states, and fallback imagery for products without a usable image.

This repository contains the frontend only. It communicates with a separately deployed REST API for users, products, categories, registered-user carts, orders, and order items. The API implementation and database schema are not included in this repository, so backend internals cannot be verified from this codebase. The current solution is suitable for a capstone demonstration, but the security and transaction limitations in Section 11 must be addressed before production use.

## 1. Project Background

### 1.1 Problem Statement

Customers expect an online shop to provide a simple path from product discovery to order confirmation. The project therefore needed to combine catalogue browsing, account access, cart management, checkout, localization, and order history in one consistent interface while integrating with a persistent backend service.

### 1.2 Project Objectives

The project objectives were to:

- create a clear and responsive online storefront;
- allow customers to shop without mandatory registration;
- support customer registration, login, session persistence, and logout;
- retrieve products and categories from a REST API;
- support product search, category filtering, and product detail views;
- provide guest and registered-customer cart flows;
- create orders and order-item records through the API;
- provide registered-customer order history and same-browser guest order lookup;
- support four interface languages and two appearance themes; and
- produce a deployable optimized frontend with supporting documentation.

### 1.3 Project Scope

The implemented frontend includes:

- home, product catalogue, and product detail views;
- client-side product search by name or SKU;
- client-side category filtering;
- registration and JWT-based login through the hosted API;
- local session restoration from browser storage;
- guest carts stored in browser local storage;
- API-backed carts for authenticated customers;
- quantity updates, item removal, cart totals, and empty-cart handling;
- guest and registered-customer checkout;
- order confirmation and registered-customer order history;
- same-browser guest order lookup by order code;
- English, Chinese, Malay, and Tamil translations;
- persistent light and dark themes; and
- responsive CSS layouts and product image fallback behavior.

The following are outside the implemented scope:

- real payment authorization or payment gateway integration;
- password reset, email verification, social login, or multi-factor authentication;
- an administration interface;
- product reviews, wish lists, recommendations, coupons, and returns;
- shipping-provider integration, invoices, and email notifications;
- URL-based routing with React Router; and
- automated unit, integration, and end-to-end test suites.

## 2. Users and Functional Requirements

### 2.1 User Types

| User type | Available capabilities |
| --- | --- |
| Guest | Browse, search, filter, view products, use a local cart, check out, view the latest confirmation, and look up locally retained guest orders. |
| Registered customer | All shopping capabilities, an API-backed cart, profile-based checkout details, account discount when supplied by the API, and personal order history. |
| Administrator | No administration interface is implemented in this repository. Product and category mutation functions exist in API modules but are not exposed through the UI. |

### 2.2 Primary User Journey

1. The shopper opens the home page and browses featured products or categories.
2. The shopper may register, log in, or continue as a guest.
3. The shopper searches or filters the catalogue and opens a product detail view.
4. The shopper adds one or more products to the cart.
5. The shopper adjusts quantities or removes unwanted items.
6. The shopper enters contact and shipping information at checkout.
7. The application refreshes product data, calculates the order values, creates the order, and then creates its order-item records through the API.
8. The application clears the cart and displays an order confirmation.
9. A registered customer can review the order from My Orders. A guest can retrieve an order retained in the same browser by entering its order code.

### 2.3 Implemented User Stories

| ID | User story | Implementation status |
| --- | --- | --- |
| US-01 | As a visitor, I can browse products without an account. | Implemented |
| US-02 | As a visitor, I can register and automatically sign in. | Implemented through `POST /users`, followed by `POST /login` |
| US-03 | As a customer, I can log in and log out. | Implemented |
| US-04 | As a shopper, I can search by product name or SKU. | Implemented in the browser |
| US-05 | As a shopper, I can filter products by category. | Implemented in the browser |
| US-06 | As a shopper, I can view product details and choose a quantity. | Implemented |
| US-07 | As a shopper, I can add, update, and remove cart items. | Implemented |
| US-08 | As a guest, I can complete checkout without registering. | Implemented |
| US-09 | As a registered customer, I can complete checkout with my order linked to my account. | Implemented |
| US-10 | As a registered customer, I can view my prior orders. | Implemented, with client-side ownership filtering |
| US-11 | As a guest, I can look up my order by its code. | Implemented for orders saved in the same browser only |
| US-12 | As a shopper, I can use the interface in one of four languages. | Implemented |
| US-13 | As a shopper, I can choose light or dark appearance. | Implemented |
| US-14 | As a customer, I can make a real online payment. | Not implemented |
| US-15 | As an administrator, I can manage products in a dedicated interface. | Not implemented |

## 3. Technology Stack

| Area | Technology | Role in the project |
| --- | --- | --- |
| UI library | React 19 | Component-based storefront interface |
| Build tooling | Vite 8 | Development server and optimized production build |
| Language | JavaScript and JSX | Application and component logic |
| Styling | Plain CSS | Responsive layouts, component styles, and themes |
| Localization | i18next and react-i18next | Translation and active-language management |
| State management | React Context and hooks | Authentication, cart, and theme state |
| Persistence | Browser local storage | Session, language, theme, guest cart, and guest order cache |
| Data access | Browser Fetch API | Communication with the hosted REST API |
| API | Separate hosted REST service | Users, login, products, categories, carts, orders, and order items |
| Hosting target | Vercel or another static host | Deployment of the generated `dist` directory |
| Version control | Git and GitHub | Team collaboration and source history |

`bcryptjs` is listed as a frontend dependency but is not used by the current source code. Password verification is performed by the backend login endpoint.

## 4. System Architecture

### 4.1 Logical Architecture

```text
User's browser
  └── React/Vite single-page application
       ├── Page components
       ├── Auth, Cart, and Theme contexts
       ├── i18next translation resources
       ├── localStorage
       └── Fetch-based API modules
             └── Hosted REST API on Vercel
                   └── Backend data store (outside this repository)
```

The application entry point wraps `App` with `ThemeProvider`, `AuthProvider`, and `CartProvider`. `App.jsx` stores the active page in React state and renders the matching page component. Page components call functions in `src/api`, while shared user, cart, and theme data are supplied through React Context.

### 4.2 Navigation Model

The project does not use React Router. Navigation keys such as `products`, `product/5`, and `order-confirmation/12` are held in component state and interpreted by `App.jsx`.

| Internal page key | View |
| --- | --- |
| `home` | Home and featured products |
| `products` | Product catalogue, search, and filters |
| `product/<id>` | Product details |
| `cart` | Cart contents and totals |
| `login` | Customer login |
| `register` | Customer registration |
| `checkout` | Shipping form and order summary |
| `order-confirmation/<id>` | Confirmation for a newly created order |
| `dashboard` | Protected customer order history |
| `track-order/<code>` | Same-browser guest order lookup |

Because navigation is held in memory, a browser refresh returns the application to the home page and views do not have directly shareable URLs.

### 4.3 Frontend Structure

```text
src/
├── api/          REST API request and response-normalization modules
├── assets/       Imported image assets
├── component/    Reusable header, menus, cards, cart items, and controls
├── context/      Authentication, cart, and theme providers
├── i18n/         English, Chinese, Malay, and Tamil resources
├── pages/        Storefront page components and page-specific CSS
├── utils/        Product image fallback helper
├── App.jsx       Application shell and state-based page selection
└── main.jsx      React entry point and provider composition
```

## 5. Major Implementation Areas

### 5.1 Product Catalogue

Products are retrieved from `GET /products` and normalized so that API fields such as `title`/`name` and `unit_price`/`price` can be displayed consistently. Categories are retrieved from `GET /categories`.

The home and products pages support category filtering. The products page also performs case-insensitive searches against product names and SKUs. Product detail pages request a single product and its category, provide quantity controls, prevent values below one, and disable ordering when a product is inactive. Invalid images are replaced with a local placeholder.

### 5.2 Authentication

Registration sends the customer's full name, normalized email, password, default membership tier, and zero discount to `POST /users`. After successful registration, the application calls `POST /login`. Login returns a JWT and user record.

The frontend stores the JWT and user information in local storage and restores them when the application reloads. Protected content checks for both a token and a user object. Logout clears the stored authentication data.

This frontend does not independently verify JWT expiry or refresh tokens. Actual authentication and authorization guarantees therefore depend on the separately deployed backend.

### 5.3 Cart Management

Cart behavior differs by user type:

- Guest items are maintained in React state and saved to the `cart` local-storage key. A generated guest session token is also retained for compatibility with guest cart APIs, although current guest add/update/remove operations remain local.
- Registered-customer carts are resolved or created through `/carts`. Their cart items are read and changed through `/cart-items`, with Bearer authorization when a token is available.
- Product details are fetched to hydrate registered cart items for display.
- If an authenticated cart request fails, the context attempts to use the local cached cart.

The cart calculates item count and total price in the browser. It supports adding an existing product, changing quantities, removing items, clearing the cart, and blocking checkout when empty.

### 5.4 Checkout and Orders

Checkout collects the customer's name, email, phone number, and shipping address. For a registered customer, the latest profile is retrieved before order creation and the account email is used.

Before submission, the frontend re-fetches every product and calculates line subtotals using the latest returned prices. It reads the registered customer's `discount_percentage`, calculates the discount, creates a unique order code, and sends an order record to `POST /orders`. It then creates each order item separately through `POST /order-items`.

The payment-method radio buttons are demonstrational. The selected method is not included in the order request, no card details are collected, and no payment provider is contacted.

For registered customers, the confirmation view retrieves the new order and its items from the API. For guests, confirmation data and up to 20 recent guest orders are cached in local storage so they can be displayed again in the same browser.

### 5.5 Order History and Tracking

The protected dashboard retrieves orders from `GET /orders` and filters them in the browser by the signed-in user's ID. Selecting an owned order retrieves its details and order items.

Guest lookup searches locally stored guest-order records by `order_code` or `order_number`. It does not query a restricted server-side tracking endpoint. Consequently, guest tracking works only on the same browser and device where checkout occurred and only while that local data remains available.

### 5.6 Localization and Theme

The interface includes translation resources for:

| Code | Language |
| --- | --- |
| `en` | English |
| `zh` | Simplified Chinese |
| `ms` | Malay |
| `ta` | Tamil |

The selected language is saved under `appLanguage` and restored on startup. English is the fallback. Language changes also update the document language and title. Product catalogue translations are resolved through catalogue helper keys when translations are available.

The theme toggle applies or removes the `dark` class on the document root and stores the selection under `theme`. Theme styling remains usable even if storage is unavailable.

## 6. REST API Integration

The frontend currently hard-codes this base URL in each API module:

```text
https://capstone-project-backend-delta.vercel.app/api
```

### 6.1 Endpoints Used by the Interface

| Method | Endpoint | Frontend use |
| --- | --- | --- |
| `POST` | `/login` | Authenticate a customer and receive a JWT |
| `POST` | `/users` | Register a customer |
| `GET` | `/users/:id` | Refresh profile data for checkout |
| `GET` | `/products` | Load the catalogue |
| `GET` | `/products/:id` | Load current product details and prices |
| `GET` | `/categories` | Load category filters and category details |
| `GET`, `POST` | `/carts` | Find or create a registered-customer cart |
| `GET`, `POST` | `/cart-items` | Load and add registered-customer cart items |
| `PUT`, `DELETE` | `/cart-items/:id` | Change or remove registered-customer cart items |
| `GET`, `POST` | `/orders` | Load order history or create an order |
| `GET` | `/orders/:id` | Load one registered-customer order |
| `POST` | `/order-items` | Create an order line |
| `GET` | `/order-items/order/:id` | Load lines for an order |

Additional create, update, and delete helpers for products, categories, carts, and orders exist in `src/api`, but they are not called by the current storefront UI.

### 6.2 Response Normalization

The API modules normalize several possible backend response shapes. Examples include:

- `title` to `name` and `unit_price` to numeric `price` for products;
- `full_name` to `name` for users;
- `order_code` to `order_number` for display;
- `subtotal_amount` and `total_amount` to numeric `subtotal` and `total`; and
- `product_title` to `product_name` for order items.

This compatibility layer reduces coupling between page components and variations in API field naming.

## 7. Data Model Used by the Frontend

The backend schema is outside this repository. The following model is inferred only from request bodies and response fields used by the frontend.

| Entity | Fields used by the frontend |
| --- | --- |
| User | `id`, `full_name`/`name`, `email`, `password`, `membership_tier`, `discount_percentage`, optional address and phone |
| Category | `id`, `name` and display metadata returned by the API |
| Product | `id`, `category_id`, `sku`, `title`/`name`, `description`, `unit_price`/`price`, `image_url`, `is_active`, `created_at` |
| Cart | `id`, nullable `user_id`, optional `session_token` |
| Cart item | `id`, `cart_id`, `product_id`, `quantity` |
| Order | `id`, nullable `user_id`, `order_code`, `auth_token`, `customer_type`, customer contact fields, shipping address, subtotal, discount, total, status, and timestamp |
| Order item | `id`, `order_id`, `product_id`, `sku`, product-title snapshot, unit price, quantity, and subtotal |

Expected relationships are: category to products, user to carts and orders, cart to cart items, product to cart/order items, and order to order items. Database constraints and transaction behavior must be confirmed in the backend repository.

## 8. User Interface and Accessibility

The application uses a consistent header containing home and product navigation, authentication controls, language selection, a theme toggle, and a live cart count. The home page provides a hero call to action, category menu, and product grid. Separate layouts support product details, cart management, checkout, confirmation, tracking, and order history.

Accessibility-oriented implementation includes:

- explicit labels for form controls;
- semantic buttons for application navigation;
- alternative text for product images;
- screen-reader text and accessible labels for language and theme controls;
- disabled button states during relevant operations; and
- visible loading, error, empty, and success states.

Manual keyboard, screen-reader, contrast, and cross-browser verification is still required before claiming formal accessibility conformance.

## 9. Testing and Verification

### 9.1 Automated Project Checks

The following checks were executed on 5 August 2026:

| Check | Result | Notes |
| --- | --- | --- |
| `npm run lint` | Passed with warnings | No ESLint errors; four `react-hooks/exhaustive-deps` warnings |
| `npm run build` | Passed | Vite 8.1.5 transformed 92 modules and generated the production assets |

The four lint warnings concern missing effect dependencies in `DashboardPage.jsx`, `OrderConfirmationPage.jsx`, `ProductDetailsPage.jsx`, and `ProductsPage.jsx`. They do not block the build but should be resolved to avoid stale closures and unclear effect behavior.

### 9.2 Manual Acceptance Coverage

The detailed manual test catalogue is maintained in [`docs/TEST_CASES.md`](./TEST_CASES.md). It covers:

- installation, linting, building, and preview startup;
- home-page and navigation behavior;
- catalogue display, search, filtering, details, quantity limits, and image fallback;
- registration, login, logout, and protected content;
- guest and registered carts;
- checkout, confirmation, dashboard history, and guest lookup;
- language and theme persistence;
- responsive layouts and accessibility basics;
- API failure behavior; and
- production smoke testing.

No automated test runner is configured in `package.json`, and this report does not claim that every manual case has been executed. Test execution should record the tester, date, build or commit, environment, result, actual behavior, and evidence.

### 9.3 Recommended Demonstration Flow

1. Open the home page and switch language and theme.
2. Filter a category and search for a product by name or SKU.
3. Open product details and add a chosen quantity to the cart.
4. Change the quantity and show the recalculated cart total.
5. Complete a guest checkout and save the generated order code.
6. Use Track Order to retrieve the locally retained guest order.
7. Register or log in, add a product, and complete a customer checkout.
8. Open My Orders and display the newly created order and its items.

## 10. Deployment

The frontend builds to static files in `dist` and can be hosted on Vercel or another HTTPS static host. The required build settings are:

| Setting | Value |
| --- | --- |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Supported Node.js | `20.19+` or `22.12+` |
| Runtime frontend secrets | None |

The deployed frontend must be permitted by the backend's CORS configuration. The current repository does not record a confirmed production frontend URL. Deployment, smoke testing, rollback, and troubleshooting instructions are in [`docs/DEPLOYMENT.md`](./DEPLOYMENT.md).

## 11. Limitations and Risk Assessment

| Priority | Limitation or risk | Impact | Recommended improvement |
| --- | --- | --- | --- |
| Critical | Prices, discounts, and totals are calculated in the browser and submitted to the API. | A modified client could submit incorrect financial values if the backend trusts them. | Make the backend accept product IDs and quantities only, then validate stock and calculate all totals server-side. |
| Critical | The order is created before order items, and each item is posted separately. | A failure can leave an order with missing or partial lines. | Provide one transactional checkout endpoint that creates the order and all items atomically. |
| High | Dashboard orders, carts, and cart items are retrieved broadly and filtered in the browser. | Data exposure is possible if the backend does not enforce ownership. | Add authenticated, ownership-scoped endpoints such as `/orders/my-orders` and `/carts/me`; enforce access on every item request. |
| High | JWT and user data are stored in local storage without client-side expiry handling. | Tokens are exposed to successful XSS and stale sessions can remain displayed. | Use strong server validation, short token lifetimes, safe refresh/session design, CSP, and explicit 401 handling. |
| High | Guest tracking is local-storage lookup rather than secure server tracking. | Orders cannot be tracked on another device and disappear when browser data is cleared. | Add a rate-limited server lookup requiring an order code plus a second verifier. |
| High | Payment options are display-only. | The interface could imply a payment was processed when none occurred. | Label checkout as demonstration-only or integrate a compliant hosted payment flow. |
| Medium | The API base URL is repeated and hard-coded in every API module. | Changing environments requires source edits and rebuilding. | Centralize it with `import.meta.env.VITE_API_BASE_URL`. |
| Medium | Navigation uses transient component state. | Refreshes return home; views cannot be bookmarked or shared. | Adopt React Router and configure static-host fallback routing. |
| Medium | There are four hook dependency warnings. | Effects may use stale values after future changes. | Stabilize callbacks with `useCallback` or define async work inside each effect. |
| Medium | No automated tests are configured. | Regressions rely on manual discovery. | Add component/unit tests and browser-based end-to-end coverage for the purchase journey. |
| Low | `bcryptjs` is an unused frontend dependency. | Adds unnecessary dependency surface. | Remove it unless a justified frontend use is introduced. |

## 12. Project Outcome and Recommendations

The project delivers the principal capstone storefront journey: product discovery, customer access, cart management, checkout, order confirmation, order history, localization, and theming. The production build completes successfully, and the code is organized into pages, reusable components, contexts, translation resources, and API modules.

The solution is demonstration-ready after the hosted frontend and backend are smoke-tested together. It should not be presented as production-ready for real customers or payments until server-side ownership controls, transactional checkout, server-calculated prices and discounts, secure guest lookup, and stronger session handling are verified or implemented.

Recommended next steps, in priority order, are:

1. replace the multi-request checkout with one server-side transactional endpoint;
2. enforce server-side price, discount, stock, and resource-ownership rules;
3. add scoped order/cart endpoints and secure guest order retrieval;
4. centralize environment configuration and introduce URL routing;
5. resolve the four lint warnings;
6. add automated tests for authentication, cart, checkout, and order history; and
7. record the final frontend URL, deployed commit, manual test evidence, and presentation screenshots.

## 13. Conclusion

Capstone G1 Shop demonstrates a coherent React e-commerce frontend integrated with a hosted API. Its strongest outcomes are the complete guest and customer shopping flows, practical response normalization, multilingual presentation, theme persistence, responsive interface, and clear separation of shared state and API access. The documented limitations provide a realistic path from a successful educational prototype to a more secure and maintainable production architecture.

## References

- [`README.md`](../README.md) — project overview, setup, structure, and limitations
- [`docs/DEPLOYMENT.md`](./DEPLOYMENT.md) — deployment and operational guide
- [`docs/TEST_CASES.md`](./TEST_CASES.md) — manual acceptance test catalogue
- [`package.json`](../package.json) — dependency and command definitions
- [`src/App.jsx`](../src/App.jsx) — navigation and application shell
- [`src/context`](../src/context) — authentication, cart, and theme state
- [`src/api`](../src/api) — REST integration modules
- [`src/i18n`](../src/i18n) — language configuration and translation resources
