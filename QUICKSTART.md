# Quick Start

## Run the app locally

```bash
npm ci
npm run dev
```

The app runs at `http://localhost:3000`.

## Required local setup

1. Copy `.env.example` to `.env.local`
2. Set your local values
3. Start MongoDB
4. Run the app from the repository root

## Common commands

```bash
npm run dev
npm run build
npm run start
npm run typecheck
npm run lint
npm run format:check
npm run test
npm run seed:products
```

## Docker

```bash
docker compose up --build
```

## Important paths

- App router: `app/`
- Reusable UI: `components/`
- Feature modules: `features/`
- Database and repositories: `lib/database/`, `lib/repositories/`
- Static files: `public/`
- Scripts: `scripts/`

## Checkout flow overview

1. Customer submits the checkout form
2. `app/api/checkout/route.ts` validates the request
3. `lib/checkout.ts` creates a pending order and order items
4. `lib/payments.ts` initializes a Paystack transaction
5. Customer completes payment on Paystack
6. `app/api/payments/callback/route.ts` verifies the payment
7. The order is marked as paid
8. `lib/notifications.ts` sends confirmation emails through Resend

## Payment methods

All checkout payment options are Paystack-backed:

- `card`
- `bank_transfer`
- `ussd`

## Email

Order notifications use Resend. Configure:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_FROM_NAME`
- `STORE_OWNER_EMAIL`
