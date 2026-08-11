# Battery Store Setup Guide

## Overview

This repository now runs as a single root-level Next.js application using `npm`.
There is no nested `frontend/` workspace anymore.

Core integrations:

- Next.js 16
- React 19
- TypeScript
- MongoDB
- Paystack
- Resend

## Project structure

```text
.
├── app/                    # App Router pages and API routes
├── assets/                 # Local design assets
├── components/             # Shared UI components
├── constants/              # Shared constants
├── data/                   # Static and seed data
├── features/               # Feature-based modules
├── hooks/                  # Shared React hooks
├── lib/                    # Infrastructure and business helpers
│   ├── database/           # Mongo connection and schemas
│   └── repositories/       # Repository pattern implementations
├── public/                 # Public static files
├── schemas/                # Zod schemas
├── scripts/                # Root scripts
├── store/                  # Client stores
├── types/                  # Shared types
├── utils/                  # Utilities
├── Dockerfile
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

## Install dependencies

```bash
npm ci
```

## Environment variables

Create `.env.local` in the repository root.

Typical local values:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/battery-webstore
MONGODB_DB_NAME=battery-webstore
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_URL=http://localhost:3000
PAYMENT_PROVIDER=mock
PAYSTACK_SECRET_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_FROM_NAME=Battery Store
STORE_OWNER_EMAIL=owner@example.com
```

### Local development notes

- `PAYMENT_PROVIDER=mock` is the easiest local mode.
- To test real Paystack flows locally, switch `PAYMENT_PROVIDER=paystack`
  and set `PAYSTACK_SECRET_KEY`.
- Resend emails only send when `RESEND_API_KEY` and `RESEND_FROM_EMAIL`
  are configured.

## Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Validation commands

```bash
npm run typecheck
npm run lint
npm run build
npm run test
```

## Checkout architecture

### Request flow

1. The checkout UI collects customer details, delivery method, payment
   method, and cart items.
2. `app/api/checkout/route.ts` validates the payload with Zod.
3. `lib/checkout.ts` computes totals and creates a pending order.
4. `lib/repositories/order.repository.ts` persists the order and order
   items in MongoDB.
5. `lib/payments.ts` initializes the Paystack transaction.
6. The frontend redirects the customer to the Paystack payment URL.
7. `app/api/payments/callback/route.ts` verifies the reference.
8. The order is updated to `paid` after successful verification.
9. `lib/notifications.ts` sends order emails via `lib/email.ts`.

### Supported payment methods

All payment methods are routed through Paystack:

- `card`
- `bank_transfer`
- `ussd`

## Database layer

MongoDB access is split by concern:

- `lib/database/mongodb.connection.ts`
  - connection lifecycle
  - collection access
  - schema types
  - index creation
- `lib/repositories/product.repository.ts`
  - product queries
  - product writes
- `lib/repositories/order.repository.ts`
  - order queries
  - order item writes
  - payment status updates

## Docker

Run the root app with:

```bash
docker compose up --build
```

The compose file builds from the repository root.

## CI

The GitHub workflow in `.github/workflows/setup.yml` runs from the root and uses:

- `npm ci`
- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

## Production checklist

Before deploying:

1. Set `PAYMENT_PROVIDER=paystack`
2. Add a real `PAYSTACK_SECRET_KEY`
3. Add Resend credentials
4. Point `NEXT_PUBLIC_APP_URL` and `APP_URL` to the production domain
5. Point `MONGODB_URI` to the production MongoDB instance
6. Configure the Paystack callback/webhook URL
