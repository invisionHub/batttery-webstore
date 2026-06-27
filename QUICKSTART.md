# Quick Start Commands

## Running the Entire Stack with Docker

```bash
# Clone and navigate to project
git clone <repo-url>
cd client-battery-store

# Build and start all services
docker compose up --build

# In another terminal, check if everything is running
docker compose ps
```

The app will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database: localhost:5432

## Backend Development (Local)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start dev server (watches for changes)
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Frontend Development (Local)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Docker Compose Commands

```bash
# Start services
docker compose up
docker compose up -d          # Background mode

# View logs
docker compose logs -f        # All services
docker compose logs backend   # Specific service

# Stop services
docker compose down
docker compose down -v        # Remove volumes (careful!)

# Rebuild after dependency changes
docker compose build --no-cache
docker compose up

# Run commands inside container
docker compose exec backend npm test
docker compose exec backend npm run build

# Shell access
docker compose exec backend sh
docker compose exec -it db psql -U postgres
```

## Database

### Access PostgreSQL in Docker

```bash
docker compose exec -it db psql -U postgres -d baterry_store
```

### Useful SQL Commands

```sql
-- List tables
\dt

-- Describe table
\d table_name

-- List databases
\l

-- Connect to database
\c battery_store
```

## Testing the API

### Using curl

```bash
# Check health
curl http://localhost:5000/health

# Get all products
curl http://localhost:5000/api/products

# Create a product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Battery 9V","price":"5.99","stock":100}'
```

### Using VS Code REST Client

1. Install "REST Client" extension
2. Create a `.http` file in the backend directory
3. Add requests:

```http
### Get all products
GET http://localhost:5000/api/products

### Create product
POST http://localhost:5000/api/products
Content-Type: application/json

{
  "name": "Battery AA",
  "price": "2.99",
  "stock": 100
}
```

## Important Files

- **Backend** - `backend/src/app.ts` (Express setup)
- **Backend** - `backend/src/server.ts` (Entry point)
- **Frontend** - `frontend/app/page.tsx` (Home page)
- **Frontend** - `frontend/next.config.ts` (Next.js config)
- **Docker** - `docker-compose.yml` (Services config)
- **CI/CD** - `.github/workflows/` (Automated tests/builds)

## Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@db:5432/exam_system
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: description"

# Push to GitHub
git push origin feature/my-feature

# Create Pull Request on GitHub
# GitHub Actions will automatically test your changes
```

## Common Issues & Solutions

### Port Already in Use

```bash
# Kill the process using port 5000 (backend)
lsof -i :5000
kill -9 <PID>

# Or use docker compose with different ports
# Edit docker-compose.yml ports section
```

### Database Connection Failed

```bash
# Check if db container is running
docker compose ps

# Check db logs
docker compose logs db

# Verify DATABASE_URL in .env
# Should be: postgresql://postgres:postgres@db:5432/exam_system
```

### npm packages not installing

```bash
# Clear Docker cache and rebuild
docker compose down -v
docker compose build --no-cache
docker compose up
```

### Port 3000 (Frontend) Already in Use

```bash
# Same as above but for port 3000
lsof -i :3000
kill -9 <PID>
```

## Development Tips

1. **Auto-reload** - Both frontend and backend support hot-reload in development
2. **Logs** - Check `docker compose logs -f` for real-time errors
3. **Tests** - Run `npm test` before pushing to ensure CI passes
4. **Formatting** - Frontend uses Prettier, use `npm run format` if available
5. **Linting** - Run `npm run lint` to check code quality

## Documentation

See `SETUP_GUIDE.md` for complete documentation.
