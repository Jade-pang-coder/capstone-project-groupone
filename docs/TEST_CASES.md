# Test Cases

This document defines the manual acceptance tests for Capstone G1 Shop. It
covers the React frontend and its integration with the hosted REST API.

## 1. Purpose and Scope

The test suite covers:

- application startup and navigation;
- product catalog, categories, search, and product details;
- registration, login, logout, and protected pages;
- guest and registered-customer carts;
- checkout, order confirmation, tracking, and order history;
- localization, theme, persistence, responsiveness, and accessibility basics;
- API failures and important security-oriented checks;
- production deployment smoke testing.

It does not validate the backend implementation internally, database
performance, real payment processing, or email delivery.

## 2. Test Environment

| Item | Test value |
| --- | --- |
| Frontend | Local preview or a non-production deployment |
| Backend | `https://capstone-project-backend-delta.vercel.app/api` |
| Desktop browser | Current Chrome, Edge, Firefox, or Safari |
| Mobile viewport | Approximately 390 × 844 |
| Node.js for local tests | `20.19+` or `22.12+` |
| Starting language | English |
| Starting theme | Light, unless the test specifies otherwise |

Run the application locally with:

```bash
npm ci
npm run build
npm run preview
```

Use a preview or test environment for cases that create users, carts, and
orders. These tests write records to the configured backend.

## 3. Test Data

Create unique data for each execution to prevent conflicts:

| Data | Example |
| --- | --- |
| Registered name | `QA Test User` |
| Registered email | `qa+<timestamp>@example.com` |
| Valid password | `TestPass123!` |
| Invalid short password | `Test123` |
| Guest name | `Guest Test User` |
| Guest email | `guest+<timestamp>@example.com` |
| Address | `10 Test Street, Singapore 123456` |
| Phone | `81234567` |
| Unknown search | `NO_PRODUCT_<timestamp>` |
| Unknown order code | `ORD-NOT-FOUND-<timestamp>` |

Select an active product with a valid price for positive catalog and checkout
tests. Select an inactive product, if one exists, for the out-of-stock case.

## 4. Result Recording

Use the following values when executing a test:

- **Pass** — actual result matches the expected result.
- **Fail** — actual result does not match the expected result.
- **Blocked** — a dependency or environment prevents execution.
- **Not run** — the test has not been attempted.

Record results in this format:

| Field | Value |
| --- | --- |
| Test case ID | |
| Tester | |
| Date and build/commit | |
| Browser and device | |
| Result | Pass / Fail / Blocked / Not run |
| Actual result | |
| Evidence or defect link | |

## 5. Build and Startup

### TC-ENV-001 — Install locked dependencies

**Priority:** High  
**Precondition:** The repository is freshly checked out.

**Steps:**

1. Confirm `package.json` and `package-lock.json` exist.
2. Run `npm ci`.

**Expected:** Installation completes without changing the lock file.

### TC-ENV-002 — Lint the application

**Priority:** Medium  
**Steps:** Run `npm run lint`.

**Expected:** ESLint exits successfully with no errors. Warnings should be
recorded for follow-up.

### TC-ENV-003 — Create the production build

**Priority:** Critical  
**Steps:** Run `npm run build`.

**Expected:** Vite exits successfully and creates `dist/index.html` plus
fingerprinted CSS and JavaScript assets.

### TC-ENV-004 — Serve the production build

**Priority:** Critical  
**Precondition:** TC-ENV-003 passed.  
**Steps:** Run `npm run preview` and open the displayed URL.

**Expected:** The application loads without a blank screen or fatal console
error.

## 6. Navigation and Home Page

### TC-NAV-001 — Load the home page

**Priority:** Critical  
**Steps:** Open the application.

**Expected:** The header, hero area, category menu, product area, and footer are
visible. Products load from the API.

### TC-NAV-002 — Navigate through the header

**Priority:** High  
**Steps:**

1. Select Home.
2. Select Products.
3. Select Cart.
4. Select the logo.

**Expected:** Each control displays its intended page, and the logo returns to
the home page.

### TC-NAV-003 — Continue shopping from an empty cart

**Priority:** Medium  
**Precondition:** The cart is empty.  
**Steps:** Open Cart and select Continue Shopping.

**Expected:** The Products page is displayed.

### TC-NAV-004 — Scroll resets after navigation

**Priority:** Low  
**Steps:**

1. Scroll down on a long page.
2. Navigate to another page using an application control.

**Expected:** The new page starts at the top.

## 7. Product Catalog

### TC-CAT-001 — Display products and prices

**Priority:** Critical  
**Steps:** Open Products.

**Expected:** Product cards show localized names, SKU or supporting details,
prices formatted to two decimal places, images, and appropriate actions.

### TC-CAT-002 — Filter products by category

**Priority:** High  
**Steps:**

1. Select a category containing products.
2. Review the displayed result count and cards.

**Expected:** Only products whose `category_id` matches the selected category
are displayed.

### TC-CAT-003 — Search by product name

**Priority:** High  
**Steps:** Enter part of a known product name in the search field.

**Expected:** Matching products remain visible; matching is case-insensitive.

### TC-CAT-004 — Search by SKU

**Priority:** High  
**Steps:** Enter all or part of a known SKU.

**Expected:** Products with matching SKUs are displayed.

### TC-CAT-005 — Combine category and search filters

**Priority:** Medium  
**Steps:**

1. Select a category.
2. Search for a product in that category.

**Expected:** Results satisfy both the selected category and search text.

### TC-CAT-006 — Clear an empty result

**Priority:** Medium  
**Steps:**

1. Search using the unknown-search test data.
2. Select Clear Filters.

**Expected:** A no-products message appears before clearing. After clearing,
the search and category filters reset and products reappear.

### TC-CAT-007 — View product details

**Priority:** High  
**Steps:** Select View Details on an active product.

**Expected:** The details page shows the product name, SKU, price, stock state,
description, category, date, quantity controls, and navigation actions.

### TC-CAT-008 — Enforce minimum product quantity

**Priority:** High  
**Steps:**

1. Open a product detail page.
2. Attempt to reduce the quantity below 1.
3. Type `0`, a negative value, and non-numeric text in the quantity field.

**Expected:** The effective quantity remains at least 1 and the decrement
button is disabled at 1.

### TC-CAT-009 — Prevent ordering an inactive product

**Priority:** High  
**Precondition:** An inactive product exists.  
**Steps:** Open its product details.

**Expected:** The product is marked out of stock and Add to Cart is disabled.

### TC-CAT-010 — Use the image fallback

**Priority:** Medium  
**Precondition:** A product has no image URL or an invalid image URL.  
**Steps:** Display the product card and details page.

**Expected:** The placeholder appears without a broken-image icon.

## 8. Registration and Authentication

### TC-AUTH-001 — Register a new customer

**Priority:** Critical  
**Steps:**

1. Open Register.
2. Enter a unique valid name, email, password, and matching confirmation.
3. Submit.

**Expected:** The user record is created, the customer becomes authenticated,
and the home page shows a welcome message and My Orders/Logout controls.

### TC-AUTH-002 — Reject mismatched passwords

**Priority:** High  
**Steps:** Submit valid registration data with different password and
confirmation values.

**Expected:** A password-mismatch error appears and no account is created.

### TC-AUTH-003 — Reject a short registration password

**Priority:** High  
**Steps:** Enter the short-password test data and attempt to submit.

**Expected:** The browser or application prevents submission and communicates
that at least eight characters are required.

### TC-AUTH-004 — Validate required registration fields

**Priority:** High  
**Steps:** Attempt to submit the form with each required field empty.

**Expected:** Submission is prevented and the missing field is identified.

### TC-AUTH-005 — Validate registration email format

**Priority:** High  
**Steps:** Enter `not-an-email` in the email field and submit.

**Expected:** Browser email validation prevents submission.

### TC-AUTH-006 — Log out

**Priority:** Critical  
**Precondition:** A customer is authenticated.  
**Steps:** Select Logout.

**Expected:** The home page is displayed, authenticated navigation is removed,
and Login/Register controls return.

### TC-AUTH-007 — Log in on the registration browser

**Priority:** Critical  
**Precondition:** The account was registered in this browser and the user has
logged out.  
**Steps:** Log in with the registered email and password.

**Expected:** Login succeeds and authenticated navigation is displayed.

### TC-AUTH-008 — Reject an incorrect password

**Priority:** High  
**Precondition:** The account was registered in this browser.  
**Steps:** Attempt login with the correct email and an incorrect password of at
least eight characters.

**Expected:** An incorrect-email-or-password message appears and the session is
not created.

### TC-AUTH-009 — Reject a short login password

**Priority:** Medium  
**Steps:** Enter a valid-looking email and a password shorter than eight
characters.

**Expected:** Submission is prevented or a password-length message appears.

### TC-AUTH-010 — Protect My Orders

**Priority:** Critical  
**Precondition:** The customer is logged out.  
**Steps:** Attempt to display the dashboard through the application state or developer tools.

**Expected:** ProtectedRoute displays an access restriction instead of order data.

### TC-AUTH-011 — Successful JWT login

**Priority:** Critical

**Steps:** Register a new user, then log in via the `/login` endpoint with the correct email and password.

**Expected:** The response includes a JWT token, which is stored in `localStorage`, and protected pages become accessible.

### TC-AUTH-012 — Token expiration handling

**Priority:** High

**Steps:** Log in to obtain a token, manually modify the stored token to an expired value (or wait for expiry), then attempt to access a protected page.

**Expected:** The application detects the invalid token, clears it, redirects to the login page, and displays an “session expired” message.

## 9. Cart

### TC-CART-001 — Create a guest cart

**Priority:** Critical  
**Precondition:** The customer is logged out and local storage is cleared.  
**Steps:** Add an active product to the cart.

**Expected:** A guest session token and server cart are created, a success
message appears, and the header count increases by 1.

### TC-CART-002 — Add an existing product again

**Priority:** High  
**Precondition:** A product is already in the cart.  
**Steps:** Add the same product once more.

**Expected:** The existing line quantity increases rather than creating a
duplicate cart line.

### TC-CART-003 — Add a selected quantity from product details

**Priority:** High  
**Steps:**

1. Open a product.
2. Set quantity to 3.
3. Select Add to Cart.

**Expected:** The cart increases by 3 and the detail-page selector resets to 1.

### TC-CART-004 — Update cart quantity

**Priority:** Critical  
**Precondition:** The cart contains a product.  
**Steps:** Increase and decrease its quantity.

**Expected:** The server cart is updated, the line subtotal changes, and the
header count and order total remain mathematically correct.

### TC-CART-005 — Remove a cart item

**Priority:** Critical  
**Precondition:** The cart contains a product.  
**Steps:** Select Remove for that line.

**Expected:** The item disappears and totals and header count update.

### TC-CART-006 — Display the empty-cart state

**Priority:** High  
**Steps:** Remove all items and open Cart.

**Expected:** The empty-cart message and Continue Shopping action appear; the
checkout summary is not shown.

### TC-CART-007 — Restore a cart after refresh

**Priority:** High  
**Precondition:** The cart contains at least one product.  
**Steps:** Refresh the browser.

**Expected:** The cart is restored from the server or the local fallback and
shows the correct lines and quantities.

### TC-CART-008 — Use a registered-customer cart

**Priority:** High  
**Precondition:** A customer is authenticated.  
**Steps:** Add a product, refresh, and reopen Cart.

**Expected:** The cart is associated with the customer's user ID and is restored
with the correct product.

## 10. Checkout and Orders

### TC-ORD-001 — Open checkout with cart contents

**Priority:** Critical  
**Precondition:** The cart contains at least one product.  
**Steps:** Select Checkout.

**Expected:** Shipping fields, payment choices, cart lines, and the correct
total are displayed.

### TC-ORD-002 — Prevent checkout with an empty cart

**Priority:** Critical  
**Precondition:** The cart is empty.  
**Steps:** Attempt to open or submit checkout.

**Expected:** The empty-cart state is shown and no order is created.

### TC-ORD-003 — Validate required shipping information

**Priority:** High  
**Precondition:** The cart contains a product.  
**Steps:** Attempt submission while omitting name, email, address, or phone.

**Expected:** Submission is prevented and missing information is identified.

### TC-ORD-004 — Validate checkout email format

**Priority:** High  
**Steps:** As a guest, enter an invalid email and submit.

**Expected:** Browser email validation prevents submission.

### TC-ORD-005 — Place a guest order

**Priority:** Critical  
**Steps:**

1. Add one or more products as a guest.
2. Complete valid shipping information.
3. Select a payment method.
4. Select Place Order once.

**Expected:** One order and its order-item records are created, the confirmation
page displays the generated order code and correct totals, and the cart clears.

### TC-ORD-006 — Prevent duplicate submission

**Priority:** High  
**Precondition:** A valid checkout form is ready.  
**Steps:** Double-click Place Order or click repeatedly while processing.

**Expected:** The button becomes disabled during processing and only one order
is created.

### TC-ORD-007 — Place a registered-customer order

**Priority:** Critical  
**Precondition:** A customer is authenticated and has products in the cart.  
**Steps:** Complete and submit checkout.

**Expected:** The order contains the authenticated user ID and registered email.
Any backend profile discount is reflected in the subtotal, discount, and total.

### TC-ORD-008 — Display order confirmation details

**Priority:** High  
**Precondition:** An order was placed successfully.  
**Steps:** Review the confirmation page.

**Expected:** Order code, pending status, date, customer information, item
quantities, prices, subtotal, discount, and total match the submitted order.

### TC-ORD-009 — Track a guest order

**Priority:** Critical  
**Precondition:** A guest order was created and its code was saved.  
**Steps:** Open Track Order, enter the code using different letter casing, and
submit.

**Expected:** The matching guest order and its item details are displayed.

### TC-ORD-010 — Reject an unknown order code

**Priority:** High  
**Steps:** Search using the unknown-order-code test data.

**Expected:** A not-found message appears and no previous order remains visible.

### TC-ORD-011 — Validate an empty order code

**Priority:** Medium  
**Steps:** Submit Track Order without a code.

**Expected:** Submission is prevented or an order-code-required message appears.

### TC-ORD-012 — View registered order history

**Priority:** Critical  
**Precondition:** The authenticated customer has at least one order.  
**Steps:** Open My Orders and select an order.

**Expected:** Only that user's orders are listed. Selecting an order displays
its shipping information, items, status, and totals.

### TC-ORD-013 — Back navigation from checkout

**Priority:** Medium  
**Precondition:** Checkout is open with a non-empty cart.  
**Steps:** Select Back to Cart.

**Expected:** The cart page appears and its contents remain unchanged.

## 11. Localization and Theme

### TC-I18N-001 — Switch through all supported languages

**Priority:** High  
**Steps:** Select English, Chinese, Malay, and Tamil in turn.

**Expected:** Navigation, page labels, buttons, and messages use the selected
language without showing raw translation keys.

### TC-I18N-002 — Persist the selected language

**Priority:** Medium  
**Steps:** Select a non-English language and refresh.

**Expected:** The selected language remains active, the HTML language attribute
is updated, and the page title is localized.

### TC-I18N-003 — Localize catalog content

**Priority:** Medium  
**Steps:** Change language while viewing products and an order.

**Expected:** Known translated product/category names change. Untranslated
catalog values fall back cleanly rather than becoming blank.

### TC-THEME-001 — Toggle dark and light themes

**Priority:** High  
**Steps:** Toggle the theme on the home, products, cart, form, and dashboard
pages.

**Expected:** The page changes theme without unreadable text, invisible
controls, or missing focus indicators.

### TC-THEME-002 — Persist theme selection

**Priority:** Medium  
**Steps:** Choose a theme and refresh.

**Expected:** The theme is restored before the main application renders, without
a noticeable incorrect-theme flash.

## 12. Responsive and Accessibility Checks

### TC-UI-001 — Desktop layout

**Priority:** Medium  
**Steps:** Review all main pages at approximately 1440 × 900.

**Expected:** Content is aligned, product grids and tables fit, and no controls
overlap.

### TC-UI-002 — Mobile layout

**Priority:** High  
**Steps:** Review all main pages at approximately 390 × 844.

**Expected:** Content remains usable without unintended horizontal scrolling;
navigation, cards, forms, cart, and order data remain accessible.

### TC-A11Y-001 — Keyboard navigation

**Priority:** High  
**Steps:** Navigate header controls, product actions, forms, cart controls, and
dialogs using Tab, Shift+Tab, Enter, and Space.

**Expected:** Interactive elements are reachable in logical order, focus is
visible, and controls activate from the keyboard.

### TC-A11Y-002 — Form labels and error identification

**Priority:** High  
**Steps:** Inspect and operate login, registration, checkout, and tracking
forms with a screen reader or browser accessibility tree.

**Expected:** Inputs have meaningful labels and types. Validation messages are
understandable and visually associated with the relevant form.

### TC-A11Y-003 — Image alternatives

**Priority:** Medium  
**Steps:** Inspect product images and the decorative logo.

**Expected:** Product images expose the localized product name; decorative
imagery does not add noisy duplicate announcements.

## 13. API Failure and Recovery

Use browser developer tools, request blocking, or a test backend to simulate
these cases. Do not change production data.

### TC-ERR-001 — Product API failure

**Priority:** High  
**Steps:** Block the `/products` request and load Home or Products.

**Expected:** Loading ends and a localized load-failure message appears; the
application does not crash.

### TC-ERR-002 — Category API failure

**Priority:** Medium  
**Steps:** Block the `/categories` request.

**Expected:** The category error is shown while the rest of the page remains
usable where possible.

### TC-ERR-003 — Cart API failure with cached data

**Priority:** High  
**Precondition:** A cart is cached locally.  
**Steps:** Block cart requests and refresh.

**Expected:** The application reports the fetch problem internally and attempts
to display the cached cart without crashing.

### TC-ERR-004 — Order creation failure

**Priority:** Critical  
**Steps:** Force the order POST request to fail and submit valid checkout data.

**Expected:** An error appears, controls are re-enabled, the cart remains
available, and no success confirmation is shown.

### TC-ERR-005 — Order-item creation failure

**Priority:** Critical  
**Steps:** Allow order creation but force an order-item POST to fail.

**Expected:** An error is shown and the cart is not cleared. Record any partial
order left in the backend as a transactional-integrity defect.

## 14. Security-Oriented Checks

These checks identify exposure in the current demonstration architecture; they
are not a substitute for a professional security assessment.

### TC-SEC-001 — Render user input as text

**Priority:** Critical  
**Steps:** In permitted test fields, enter harmless markup such as
`<b>QA</b>` and a non-executing script-like string.

**Expected:** Values are displayed as text and no markup or script executes.

### TC-SEC-002 — Do not expose secrets in the frontend bundle

**Priority:** Critical  
**Steps:** Search source and `dist/` for private keys, database credentials,
API secrets, Vercel tokens, and real customer credentials.

**Expected:** No secret is present. The public API URL may be visible because it
is required by the browser.

### TC-SEC-003 — Clear the active session on logout

**Priority:** High  
**Precondition:** A customer is authenticated.  
**Steps:** Log out and inspect local storage.

**Expected:** `token` and `userId` are removed and protected content is no
longer available.

### TC-SEC-004 — Prevent another customer's dashboard order selection

**Priority:** Critical  
**Precondition:** Test accounts A and B each own orders.  
**Steps:** While authenticated as A, attempt to select B's order through
modified client state.

**Expected:** The dashboard refuses the selection. The backend should also
reject unauthorized direct requests; if it returns B's data, record a critical
backend authorization defect.

## 15. Deployment Smoke Suite

Run these cases after every preview, production deployment, or rollback:

| Order | Test case | Required result |
| --- | --- | --- |
| 1 | TC-ENV-004 | Pass |
| 2 | TC-NAV-001 | Pass |
| 3 | TC-CAT-002 | Pass |
| 4 | TC-CAT-007 | Pass |
| 5 | TC-CART-001 or TC-CART-008 | Pass |
| 6 | TC-CART-004 | Pass |
| 7 | TC-ORD-005 in a safe test environment | Pass |
| 8 | TC-ORD-009 | Pass |
| 9 | TC-I18N-001 | Pass |
| 10 | TC-THEME-001 | Pass |
| 11 | Browser console and Network review | No unexpected errors |

## 16. Known Limitation Checks

The following cases document current behavior and should not be reported as new
regressions unless the related feature has been implemented.

| ID | Scenario | Current expected behavior |
| --- | --- | --- |
| KL-001 | Log in on a different browser/device | Login cannot verify the account because the password hash is stored only in the registration browser. |
| KL-002 | Refresh while viewing a non-home page | Navigation returns to Home because page state is not URL-based. |
| KL-003 | Apply a promotion code | The UI has no promotion-code logic; selecting Apply does not change totals. |
| KL-004 | Select a checkout payment method | No gateway is contacted and no real payment is processed. |
| KL-005 | Receive an order-confirmation email | The UI states confirmation information, but no email service is integrated in this repository. |
| KL-006 | Look up guest orders | The frontend fetches the order collection and filters it locally instead of using a restricted lookup endpoint. |
| KL-007 | Change the backend with an environment variable | The API URL is hard-coded and requires source changes plus a rebuild. |

These limitations should become standard acceptance or security tests when
their production implementations are added.
