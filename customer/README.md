# Move Car Rental Customer Frontend

Custom Next.js customer-facing app for the BookCars backend.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set `BOOKCARS_API_URL` to the BookCars backend URL.
3. Set `BOOKCARS_DEFAULT_SUPPLIER_ID` once the single default company/supplier exists.
4. Run `npm install`.
5. Run `npm run dev`.

## Local BookCars stack

For local booking tests, copy `backend/.env.docker.example` to `backend/.env.docker`, then set:

```env
BC_FRONTEND_HOST=http://localhost:3000/
# Easiest local dev: skip SMTP entirely (registration works without Mailpit)
BC_SMTP_DISABLED=true
# Or use Mailpit instead:
# BC_SMTP_HOST=127.0.0.1
# BC_SMTP_PORT=1026
# BC_SMTP_USER=none
# BC_SMTP_PASS=none
```

Start the backend dependencies with:

```bash
docker compose -f docker-compose.dev.yml up -d mongo mailpit bc-dev-backend
```

Mailpit captures checkout emails at `http://localhost:8026`.

The first implementation slice supports the mobile-first customer flow foundation, BookCars API wrappers, car search/detail pages, authentication routes, and pay-at-counter booking plumbing. Stripe/PayPal checkout is intentionally isolated for a later payment phase.
