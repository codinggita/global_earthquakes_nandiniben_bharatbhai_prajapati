# 🌍 Global Earthquake Analytics API

A production-ready **RESTful API** for querying, analyzing, and managing global seismic event data. Built with **Node.js**, **Express**, and **MongoDB**, it delivers rich earthquake analytics through efficient aggregation pipelines, secured routes with JWT authentication, and full request logging and rate limiting.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [NPM Scripts](#npm-scripts)
- [API Features](#api-features)
  - [Authentication](#authentication)
  - [Earthquakes](#earthquakes)
  - [Analytics](#analytics)
- [Rate Limiting](#rate-limiting)
- [Request Logging](#request-logging)
- [Data Seeding](#data-seeding)
- [Deployment Guide](#deployment-guide)

---

## Project Overview

The **Global Earthquake Analytics API** ingests seismic event data from USGS-format datasets and exposes a clean HTTP interface for:

- Filtering and paginating earthquake records across 13 query dimensions
- Computing global statistics (average magnitude, average depth, total count, deepest event, strongest event) in a **single MongoDB round-trip**
- Grouping events by country and monthly trends for dashboard consumption
- Securing write operations behind JWT-based RBAC (admin only)
- Protecting all routes with per-prefix rate limiting

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js ≥ 18 |
| Framework | Express.js 4 |
| Database | MongoDB via Mongoose 8 |
| Authentication | JSON Web Tokens (jsonwebtoken) |
| Password Hashing | bcrypt |
| Validation | Joi |
| Rate Limiting | express-rate-limit |
| Environment | dotenv |
| Dev Server | nodemon |

---

## Folder Structure

```
server/
├── app.js                    # Express app — middleware + route mounting
├── server.js                 # Entry point — DB connect + HTTP listen
├── .env                      # Local secrets (git-ignored)
├── .env.example              # Template for required env vars
│
├── config/
│   └── db.js                 # Mongoose connection + lifecycle events
│
├── controllers/
│   ├── analyticsController.js
│   ├── authController.js
│   └── earthquakeController.js
│
├── data/
│   ├── sample_earthquakes.json  # 52-record USGS seed dataset
│   └── seed.js                  # Import / delete CLI script
│
├── docs/
│   ├── API.md                # Full API reference (request + response examples)
│   └── CHANGELOG.md
│
├── helpers/
│   └── geoHelper.js
│
├── middlewares/
│   ├── authMiddleware.js     # JWT protect + role authorize
│   ├── errorMiddleware.js    # Global error handler + 404
│   ├── rateLimiter.js        # Per-prefix rate limiters
│   ├── requestLogger.js      # HTTP method/route/status/time logger
│   └── validate.js           # Joi schema middleware
│
├── models/
│   ├── Earthquake.js         # Mongoose schema + indexes + virtuals
│   └── User.js
│
├── routes/
│   ├── analyticsRoutes.js
│   ├── authRoutes.js
│   └── earthquakeRoutes.js
│
├── services/
│   ├── analyticsService.js   # Aggregation pipelines
│   ├── authService.js
│   ├── earthquakeService.js  # CRUD + pagination
│   └── tokenService.js
│
├── utils/
│   ├── ApiError.js           # Structured error class
│   ├── ApiResponse.js        # Standardised success envelope
│   ├── asyncHandler.js       # Promise-based error forwarding
│   ├── pagination.js
│   ├── queryBuilder.js       # Filter + sort + paginate builder
│   └── sortBuilder.js
│
└── validators/
    ├── authValidator.js
    └── earthquakeValidator.js (or earthquakeSchema)
```

---

## Setup Instructions

### Prerequisites

- **Node.js** ≥ 18 — [nodejs.org](https://nodejs.org)
- **MongoDB** ≥ 6 (local) or a [MongoDB Atlas](https://cloud.mongodb.com) cluster
- **npm** ≥ 9

### 1. Clone the repository

```bash
git clone https://github.com/your-username/global-earthquake-api.git
cd global-earthquake-api/server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values — see [Environment Variables](#environment-variables) below.

### 4. Seed the database

```bash
npm run seed:import
```

### 5. Start the development server

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### 6. Verify the server is running

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{ "status": "ok", "uptime": 3.2, "timestamp": "2026-06-01T13:35:00.000Z" }
```

---

## Environment Variables

Copy `.env.example` to `.env` and populate each value:

| Variable | Required | Description | Example |
|---|---|---|---|
| `PORT` | ❌ | HTTP port (default `5000`) | `5000` |
| `NODE_ENV` | ✅ | Runtime environment | `development` / `production` |
| `MONGO_URI` | ✅ | MongoDB connection string | `mongodb://localhost:27017/earthquakes` |
| `JWT_SECRET` | ✅ | Secret key for signing JWTs (min 32 chars) | `supersecretkey1234567890abcdef` |
| `JWT_EXPIRES_IN` | ❌ | Token expiry duration (default `7d`) | `7d` / `24h` |

> **Never commit `.env` to version control.** It is already listed in `.gitignore`.

---

## NPM Scripts

| Script | Command | Description |
|---|---|---|
| `start` | `node server.js` | Start production server |
| `dev` | `nodemon server.js` | Start dev server with hot-reload |
| `lint` | `eslint . --ext .js` | Run ESLint |
| `seed:import` | `node data/seed.js --import` | Import sample dataset (skips duplicates) |
| `seed:delete` | `node data/seed.js --delete` | Wipe all earthquake documents |

---

## API Features

**Base URL:** `http://localhost:5000`  
**Full reference:** [`docs/API.md`](./docs/API.md)

All responses follow a consistent envelope:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "...",
  "data": { },
  "pagination": { }
}
```

---

### Authentication

The API uses **JWT Bearer token** authentication.

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/auth/register` | POST | None | Create a new user account |
| `/auth/login` | POST | None | Authenticate and receive a token |

**Usage:**

```bash
# Register
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Nandini","email":"nandini@example.com","password":"secure1234"}'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nandini@example.com","password":"secure1234"}'
```

Use the returned `token` as a Bearer token on protected routes:

```
Authorization: Bearer <token>
```

**Role-based access:**
- `user` — read-only access
- `admin` — full CRUD access on earthquake records

---

### Earthquakes

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/earthquakes` | GET | None | List earthquakes with filtering + pagination |
| `/earthquakes/:id` | GET | None | Get a single earthquake by ID |
| `/earthquakes` | POST | Admin | Create a new earthquake record |
| `/earthquakes/:id` | PATCH | Admin | Update an earthquake record |
| `/earthquakes/:id` | DELETE | Admin | Soft-delete (or `?hard=true` for permanent) |

**Key query parameters for `GET /earthquakes`:**

```
?minMag=5&maxMag=7&country=Japan&startDate=2015-01-01&endDate=2016-01-01
&sortBy=magnitude&sortOrder=desc&page=1&limit=10
```

Full parameter list: [`docs/API.md → Section 3.1`](./docs/API.md)

---

### Analytics

All analytics routes use **MongoDB aggregation pipelines** — no in-memory computation.

| Endpoint | Method | Pipeline Stages | Description |
|---|---|---|---|
| `/analytics/stats` | GET | `$match → $facet → $project` | Global statistics (5 metrics, 1 round-trip) |
| `/analytics/by-country` | GET | `$group → $sort → $project` | Earthquakes grouped by country |
| `/analytics/monthly-trends` | GET | `$group ($year/$month) → $sort → $project` | Monthly event counts and averages |
| `/analytics/highest-magnitude` | GET | `$sort → $limit → $project` | Top N earthquakes by magnitude |

**Example — Global Stats:**

```bash
curl http://localhost:5000/analytics/stats
```

```json
{
  "data": {
    "averageMagnitude": 4.72,
    "averageDepth": 112.34,
    "totalCount": 52,
    "deepestEarthquake": { "depth": 607.86, "place": "209 km E of Levuka, Fiji" },
    "highestMagnitude": { "magnitude": 5.8, "place": "80 km W of Panguna, Papua New Guinea" }
  }
}
```

---

## Rate Limiting

| Route prefix | Window | Limit | Purpose |
|---|---|---|---|
| `/auth/*` | 15 min | 20 req | Brute-force / credential stuffing protection |
| `/analytics/*` | 1 min | 60 req | Aggregation cost control |
| `/earthquakes/*` | 1 min | 100 req | General throttling |

On limit exceeded — `429 Too Many Requests`:
```json
{
  "success": false,
  "statusCode": 429,
  "message": "Too many requests. Please slow down and try again later.",
  "retryAfter": 47
}
```

---

## Request Logging

Every request is logged automatically via `middlewares/requestLogger.js`.

**Development** — detailed bordered blocks with method, route, status, response time, query params, and sanitised body:

```
┌─ Incoming Request ──────────────────────────────────────────
│ GET     /analytics/stats
│ Timestamp : 2026-06-01T13:35:01.123Z
└─────────────────────────────────────────────────────────────

┌─ Response ───────────────────────────────────────────────────
│ GET     /analytics/stats
│ Status  : 200
│ Time    : 8.41 ms
└─────────────────────────────────────────────────────────────
```

**Production** — concise single-line per request:
```
[2026-06-01T13:35:01.123Z] GET /analytics/stats 200 8.41 ms
```

> Sensitive fields (`password`, `token`, `secret`) are automatically masked in body logs.

---

## Data Seeding

The project ships with a 52-record USGS earthquake dataset (`data/sample_earthquakes.json`).

```bash
# Import — safe to run multiple times (skips duplicates via upsert)
npm run seed:import

# Wipe all earthquake documents
npm run seed:delete
```

Duplicate prevention uses `bulkWrite` with `updateOne + upsert + $setOnInsert` keyed on `(latitude, longitude, time)`.

---

## Deployment Guide

### Environment Setup

1. Set `NODE_ENV=production` in your hosting environment.
2. Set all required environment variables (`MONGO_URI`, `JWT_SECRET`, etc.).
3. Use a **strong, random `JWT_SECRET`** — minimum 32 characters.

```bash
# Generate a secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Using a Process Manager (PM2)

```bash
npm install -g pm2

# Start the server
pm2 start server.js --name "earthquake-api"

# Save process list + enable startup
pm2 save
pm2 startup
```

### MongoDB Atlas (Production Database)

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Add your server's IP to the Atlas **Network Access** whitelist
3. Create a database user and copy the connection string
4. Set `MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/earthquakes?retryWrites=true&w=majority`

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

```bash
docker build -t earthquake-api .
docker run -p 5000:5000 --env-file .env earthquake-api
```

### Health Check Endpoint

```
GET /health
```

Use this as the liveness probe in Docker, Kubernetes, or any cloud platform (Railway, Render, Fly.io).

---

## License

ISC © Nandiniben Bharatbhai Prajapati