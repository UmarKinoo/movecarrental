# Move Car Rental Customer Frontend

Custom Next.js customer-facing app for the BookCars backend.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set `BOOKCARS_API_URL` to the BookCars backend URL.
3. Set `BOOKCARS_DEFAULT_SUPPLIER_ID` once the single default company/supplier exists.
4. Run `npm install`.
5. Run `npm run dev`.

The first implementation slice supports the mobile-first customer flow foundation, BookCars API wrappers, car search/detail pages, authentication routes, and pay-at-counter booking plumbing. Stripe/PayPal checkout is intentionally isolated for a later payment phase.
