# Infrastructure Setup

## Current repository model

This project is a single root-level Next.js application.

There is no separate `frontend/` package anymore. All commands, Docker
builds, CI jobs, and local development workflows run from the repository
root.

## Root runtime

- Package manager: `npm`
- App runtime: Next.js
- Database: MongoDB
- Payments: Paystack
- Transactional email: Resend

## Root Docker setup

### Build and run

```bash
docker compose up --build
```

### Dockerfile

The root `Dockerfile` builds the app from the repository root.

### Docker Compose

The root `docker-compose.yml` starts the app service from:

```yaml
services:
  app:
    build:
      context: .
```

## Environment configuration

Use root environment files only.

### Local

- `.env.local`

### Example template

- `.env.example`

Important variables include:

```env
MONGODB_URI=
MONGODB_DB_NAME=
NEXT_PUBLIC_APP_URL=
APP_URL=
PAYMENT_PROVIDER=
PAYSTACK_SECRET_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_FROM_NAME=
STORE_OWNER_EMAIL=
```

## CI pipeline

The active workflow is:

- `.github/workflows/setup.yml`

It runs from the repository root and executes:

```bash
npm ci
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

## Database architecture

MongoDB responsibilities are separated into:

- `lib/database/mongodb.connection.ts`
- `lib/repositories/product.repository.ts`
- `lib/repositories/order.repository.ts`

This keeps connection management, indexing, and repository queries in
separate layers.

## Payment infrastructure

Checkout payment options are all Paystack-backed:

- Card
- Bank transfer
- USSD

Relevant files:

- `app/api/checkout/route.ts`
- `app/api/payments/callback/route.ts`
- `app/api/payments/webhook/route.ts`
- `lib/payments.ts`

## Email infrastructure

Order notifications are sent through Resend.

Relevant files:

- `lib/email.ts`
- `lib/notifications.ts`

## Recommended deployment checks

1. Confirm root `.env` values are set correctly
2. Verify MongoDB network access
3. Verify Paystack secret and callback URLs
4. Verify Resend sender domain and from address
5. Run root validation commands before deployment
