# Docker + CI/CD Setup Guide (Monorepo)

# Overview

This guide explains how to setup:

- Docker for frontend and backend services
- PostgreSQL container
- Docker Compose orchestration
- GitHub Actions CI/CD pipelines

This setup is intended for a monorepo architecture using:

- Next.js frontend
- Express backend
- PostgreSQL database

---

# Monorepo Structure

```bash
project-root/
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── .env
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── .env
│
├── docker-compose.yml
│
├── .github/
│   └── workflows/
│       ├── frontend.yml
│       └── backend.yml
│
└── README.md
```

---

# Why Separate Dockerfiles?

Frontend and backend are separate services.

Each service:

- has different dependencies
- has different runtime requirements
- may scale independently

This is the standard architecture for modern fullstack systems.

---

# FRONTEND DOCKER SETUP

---

# Frontend Dockerfile

## `frontend/Dockerfile`

```Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

---

# Frontend Environment Variables

## `frontend/.env`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

# BACKEND DOCKER SETUP

---

# Backend Dockerfile

## `backend/Dockerfile`

```Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
```

---

# Backend Environment Variables

## `backend/.env`

```env
PORT=5000

DATABASE_URL=postgresql://postgres:postgres@db:5432/battery-store

JWT_SECRET=secret

NODE_ENV=development
```

---

# DOCKER COMPOSE SETUP

---

# Why Docker Compose?

Docker Compose allows you to orchestrate multiple services using a single configuration file.

This setup runs:

- frontend
- backend
- postgres database

with one command.

---

# Docker Compose File

## `docker-compose.yml`

```yaml
version: "3.9"

services:
  frontend:
    build: ./frontend

    container_name: frontend

    ports:
      - "3000:3000"

    volumes:
      - ./frontend:/app
      - /app/node_modules

    env_file:
      - ./frontend/.env

    depends_on:
      - backend

  backend:
    build: ./backend

    container_name: backend

    ports:
      - "5000:5000"

    volumes:
      - ./backend:/app
      - /app/node_modules

    env_file:
      - ./backend/.env

    depends_on:
      - db

  db:
    image: postgres:17

    container_name: postgres-db

    restart: always

    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: exam_system

    ports:
      - "5432:5432"

    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

# Docker Commands

---

# Build Containers

```bash
docker compose build
```

---

# Start Containers

```bash
docker compose up
```

---

# Start Containers in Detached Mode

```bash
docker compose up -d
```

---

# Stop Containers

```bash
docker compose down
```

---

# Remove Containers + Volumes

```bash
docker compose down -v
```

---

# CI/CD SETUP

# Overview

GitHub Actions is used for:

- automated testing
- builds
- deployment preparation

Frontend and backend use separate workflows because they are independent services.

---

# GitHub Actions Folder

```bash
.github/
└── workflows/
    ├── frontend.yml
    └── backend.yml
```

---

# FRONTEND CI/CD

---

# Frontend Workflow

## `.github/workflows/frontend.yml`

```yaml
name: Frontend CI

on:
  push:
    paths:
      - "frontend/**"

  pull_request:
    paths:
      - "frontend/**"

jobs:
  frontend:
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: frontend

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install Dependencies
        run: npm install

      - name: Run Build
        run: npm run build
```

---

# What This Workflow Does

When code changes inside:

```bash
frontend/
```

GitHub Actions will:

- install dependencies
- build frontend
- validate the application

This helps catch deployment errors early.

---

# BACKEND CI/CD

---

# Backend Workflow

## `.github/workflows/backend.yml`

```yaml
name: Backend CI

on:
  push:
    paths:
      - "backend/**"

  pull_request:
    paths:
      - "backend/**"

jobs:
  backend:
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: backend

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm run test

      - name: Build Application
        run: npm run build
```

---

# What This Workflow Does

When code changes inside:

```bash
backend/
```

GitHub Actions will:

- install dependencies
- run tests
- build backend

This ensures backend stability before deployment.

---

# Recommended Next Steps

After this setup, the next improvements are:

- Docker production builds
- VPS deployment
- Nginx reverse proxy
- SSL setup
- Managed PostgreSQL
- Redis caching
- Kubernetes
- Monitoring and logging

---

# Recommended Development Flow

1. Develop locally with Docker Compose
2. Push code to GitHub
3. GitHub Actions validates builds/tests
4. Deploy services to VPS or cloud platform

---

# Important Notes

## Use Separate Services

Frontend and backend should remain independent services even inside a monorepo.

This makes:

- scaling easier
- deployments cleaner
- maintenance simpler

---

## Docker Compose is for Development

Docker Compose is ideal for:

- local development
- staging
- integration testing

Production deployments usually use:

- Kubernetes
- ECS
- Docker Swarm
- VPS orchestration

---

## Keep Environment Variables Separate

Use:

- frontend/.env
- backend/.env

Never expose backend secrets to the frontend.

---

# Final Goal

This setup creates a scalable foundation for:

- SaaS products
- enterprise systems
- infrastructure platforms
- exam systems
- authentication systems
