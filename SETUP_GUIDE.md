# Battery Store - Full Stack Application

A modern full-stack e-commerce application for battery products built with Next.js, Express.js, and PostgreSQL.

## Technology Stack

### Frontend

- **Next.js 15** - React framework with SSR/SSG
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **ESLint** - Code quality

### Backend

- **Express.js** - Node.js web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - SQL ORM for PostgreSQL
- **PostgreSQL** - Relational database
- **Winston** - Logging
- **Zod** - Schema validation
- **Helmet** - Security headers
- **Vitest + Supertest** - Testing

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD pipelines

## Project Structure

```
.
├── frontend/              # Next.js frontend application
│   ├── app/              # App router pages
│   ├── src/              # React components & utilities
│   ├── package.json
│   └── Dockerfile
├── backend/              # Express.js backend API
│   ├── src/
│   │   ├── server.ts     # Entry point
│   │   ├── app.ts        # Express setup
│   │   ├── config/       # Configuration files
│   │   ├── middleware/   # Express middleware
│   │   ├── utils/        # Utilities
│   │   ├── db/           # Database schema & migrations
│   │   └── tests/        # Test files
│   ├── package.json
│   ├── Dockerfile
│   └── drizzle.config.ts # ORM configuration
├── docker-compose.yml     # Multi-container orchestration
└── .github/
    └── workflows/        # CI/CD pipelines
        ├── frontend.yml
        └── backend.yml
```

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 22+ (for local development)
- npm or yarn

### Local Development with Docker

1. **Clone the repository**

```bash
git clone <repo-url>
cd client-battery-store
```

2. **Build and start all services**

```bash
docker compose up --build
```

Services will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Database: localhost:5432

3. **View logs**

```bash
docker compose logs -f
```

4. **Stop services**

```bash
docker compose down
```

### Local Development without Docker

#### Backend Setup

1. **Install dependencies**

```bash
cd backend
npm install
```

2. **Set up environment variables**

```bash
cp .env.example .env
# Edit .env with your DATABASE_URL
```

3. **Start development server**

```bash
npm run dev
```

Backend will run on http://localhost:5000

4. **Run tests**

```bash
npm test
```

#### Frontend Setup

1. **Install dependencies**

```bash
cd frontend
npm install
```

2. **Start development server**

```bash
npm run dev
```

Frontend will run on http://localhost:3000

## Available Scripts

### Backend

```bash
npm run dev       # Start development server with auto-reload
npm run build     # Compile TypeScript to JavaScript
npm start         # Run production build
npm test          # Run tests with Vitest
```

### Frontend

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
```

## Database

The application uses PostgreSQL with Drizzle ORM.

### Database Schema

Currently includes tables for:

- `users` - User accounts
- `products` - Battery products
- `orders` - Customer orders

### Running Migrations

```bash
# Generate migrations from schema
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate
```

## Environment Variables

### Backend (.env)

```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@db:5432/exam_system
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## API Documentation

### Health Check

```
GET /health
```

### API Info

```
GET /api
```

## CI/CD Pipelines

GitHub Actions automatically:

**Frontend Workflow** (`.github/workflows/frontend.yml`)

- Triggers on changes to `frontend/**`
- Installs dependencies
- Runs build validation

**Backend Workflow** (`.github/workflows/backend.yml`)

- Triggers on changes to `backend/**`
- Installs dependencies
- Runs tests
- Builds application

## Docker Commands

```bash
# Build containers
docker compose build

# Start services
docker compose up
docker compose up -d      # Detached mode

# View logs
docker compose logs -f    # Follow logs
docker compose logs backend  # Service-specific

# Stop services
docker compose down
docker compose down -v    # Remove volumes

# Execute command in container
docker compose exec backend npm test
docker compose exec -it db psql -U postgres
```

## Troubleshooting

### Database Connection Issues

- Ensure `db` service is running: `docker compose logs db`
- Check `DATABASE_URL` in `.env` matches service hostname

### Port Already in Use

```bash
# Change ports in docker-compose.yml or:
docker compose down -v
```

### Node modules not installing

```bash
# Clear cache and rebuild
docker compose down -v
docker compose build --no-cache
docker compose up
```

## Best Practices

1. **Environment Variables** - Never commit `.env` files, use `.env.example`
2. **Database** - Use migrations for schema changes
3. **Testing** - Write tests for backend APIs
4. **Git Commits** - Push to feature branches and create PRs
5. **Docker** - Rebuild after dependency changes
6. **Logging** - Use Winston logger for backend logs

## Next Steps

- Implement authentication (JWT)
- Add product management endpoints
- Create order processing API
- Add frontend pages and components
- Set up payment processing
- Deploy to production

## Support

For issues or questions, please create a GitHub issue.

## License

ISC
