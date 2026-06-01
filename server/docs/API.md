# Global Earthquake Analytics API — Documentation

**Base URL:** `http://localhost:5000`  
**Version:** 1.0.0  
**Content-Type:** `application/json`

---

## Table of Contents

1. [Response Envelope](#1-response-envelope)
2. [Authentication](#2-authentication)
   - [Register](#21-register)
   - [Login](#22-login)
3. [Earthquakes](#3-earthquakes)
   - [List Earthquakes](#31-list-earthquakes--query-parameters)
   - [Get by ID](#32-get-earthquake-by-id)
   - [Create](#33-create-earthquake--admin)
   - [Update](#34-update-earthquake--admin)
   - [Delete](#35-delete-earthquake--admin)
4. [Analytics](#4-analytics)
   - [Global Statistics](#41-global-statistics)
   - [By Country](#42-earthquakes-by-country)
   - [Monthly Trends](#43-monthly-trends)
   - [Highest Magnitude](#44-highest-magnitude)
5. [Error Reference](#5-error-reference)
6. [Rate Limits](#6-rate-limits)

---

## 1. Response Envelope

Every response — success or error — follows a consistent envelope shape.

### Success
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Human-readable description.",
  "data": { },
  "pagination": { }
}
```

> `pagination` is only present on paginated list endpoints.

### Error
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Human-readable error description.",
  "details": ["Field-level validation messages (if any)"]
}
```

---

## 2. Authentication

The API uses **JWT Bearer tokens**. Protected routes require the token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens expire after **7 days** (configurable via `JWT_EXPIRES_IN` in `.env`).

### Authentication Flow

```
Client                          Server
  │                               │
  │  POST /auth/register          │
  │ ──────────────────────────►  │
  │                               │  Hash password (bcrypt)
  │                               │  Save User document
  │  { token, user }             │
  │ ◄──────────────────────────  │
  │                               │
  │  POST /auth/login             │
  │ ──────────────────────────►  │
  │                               │  Verify password
  │                               │  Sign JWT
  │  { token, user }             │
  │ ◄──────────────────────────  │
  │                               │
  │  GET /earthquakes/:id         │
  │  Authorization: Bearer <tok>  │
  │ ──────────────────────────►  │
  │                               │  Verify JWT → attach req.user
  │  { data: earthquake }        │
  │ ◄──────────────────────────  │
```

---

### 2.1 Register

`POST /auth/register`  
**Rate limit:** 20 req / 15 min · **Auth:** None

#### Request Body

| Field      | Type   | Required | Rules                        |
|------------|--------|----------|------------------------------|
| `name`     | string | ✅       | 2–50 characters              |
| `email`    | string | ✅       | Valid email, unique          |
| `password` | string | ✅       | Min 8 chars                  |
| `role`     | string | ❌       | `user` (default) \| `admin`  |

#### Request Example
```json
POST /auth/register
Content-Type: application/json

{
  "name": "Nandini",
  "email": "nandini@example.com",
  "password": "secure1234"
}
```

#### Response — `201 Created`
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d",
      "name": "Nandini",
      "email": "nandini@example.com",
      "role": "user"
    }
  }
}
```

---

### 2.2 Login

`POST /auth/login`  
**Rate limit:** 20 req / 15 min · **Auth:** None

#### Request Body

| Field      | Type   | Required |
|------------|--------|----------|
| `email`    | string | ✅       |
| `password` | string | ✅       |

#### Request Example
```json
POST /auth/login
Content-Type: application/json

{
  "email": "nandini@example.com",
  "password": "secure1234"
}
```

#### Response — `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d",
      "name": "Nandini",
      "email": "nandini@example.com",
      "role": "user"
    }
  }
}
```

---

## 3. Earthquakes

**Base path:** `/earthquakes`  
**Rate limit:** 100 req / min

---

### 3.1 List Earthquakes — Query Parameters

`GET /earthquakes`  
**Auth:** None

#### Query Parameters

| Parameter   | Type    | Default  | Description                                      |
|-------------|---------|----------|--------------------------------------------------|
| `page`      | integer | `1`      | Page number (1-indexed)                          |
| `limit`     | integer | `10`     | Records per page (max 100)                       |
| `minMag`    | number  | —        | Minimum magnitude (inclusive)                    |
| `maxMag`    | number  | —        | Maximum magnitude (inclusive)                    |
| `country`   | string  | —        | Filter by country name (case-insensitive)        |
| `status`    | string  | —        | `automatic` \| `reviewed` \| `deleted`           |
| `type`      | string  | —        | `earthquake` \| `quarry blast` \| `explosion` …  |
| `net`       | string  | —        | Network code e.g. `us`, `nc`, `ak`               |
| `tsunami`   | boolean | —        | `true` \| `false`                                |
| `startDate` | ISO8601 | —        | Events on or after this date                     |
| `endDate`   | ISO8601 | —        | Events on or before this date                    |
| `sortBy`    | string  | `time`   | Field to sort by (`magnitude`, `depth`, `time`)  |
| `sortOrder` | string  | `desc`   | `asc` \| `desc`                                  |

#### Request Example
```
GET /earthquakes?minMag=5&country=Japan&sortBy=magnitude&sortOrder=desc&page=1&limit=5
```

#### Response — `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "message": "3 earthquake(s) retrieved successfully.",
  "data": [
    {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d",
      "magnitude": 5.8,
      "place": "79 km SSE of Toba, Japan",
      "country": "Japan",
      "depth": 338.23,
      "latitude": 33.8836,
      "longitude": 137.3211,
      "magType": "mb",
      "status": "reviewed",
      "tsunami": false,
      "rms": 0.75,
      "gap": 57,
      "type": "earthquake",
      "net": "us",
      "time": "2015-12-30T12:57:36.210Z",
      "createdAt": "2026-06-01T12:00:00.000Z",
      "updatedAt": "2026-06-01T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 3,
    "page": 1,
    "limit": 5,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

---

### 3.2 Get Earthquake by ID

`GET /earthquakes/:id`  
**Auth:** None

#### Path Parameters

| Parameter | Type     | Description         |
|-----------|----------|---------------------|
| `id`      | ObjectId | MongoDB document ID |

#### Request Example
```
GET /earthquakes/665f1a2b3c4d5e6f7a8b9c0d
```

#### Response — `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Earthquake retrieved successfully.",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "magnitude": 5.8,
    "place": "80 km W of Panguna, Papua New Guinea",
    "country": "Papua New Guinea",
    "depth": 30.0,
    "latitude": -6.2452,
    "longitude": 154.7595,
    "magType": "mw",
    "status": "reviewed",
    "tsunami": false,
    "rms": 0.87,
    "gap": 21,
    "type": "earthquake",
    "net": "us",
    "time": "2015-12-29T01:51:41.550Z"
  }
}
```

#### Error — `404 Not Found`
```json
{
  "success": false,
  "statusCode": 404,
  "message": "No earthquake found with id \"665f1a2b3c4d5e6f7a8b9c0d\".",
  "details": []
}
```

---

### 3.3 Create Earthquake *(Admin)*

`POST /earthquakes`  
**Auth:** `Bearer <token>` · **Role:** `admin`

#### Request Body

| Field       | Type    | Required | Rules                              |
|-------------|---------|----------|------------------------------------|
| `magnitude` | number  | ✅       | −2 … 10                            |
| `place`     | string  | ✅       | Max 300 chars                      |
| `country`   | string  | ❌       | Max 100 chars                      |
| `depth`     | number  | ✅       | 0 … 1000 km                        |
| `latitude`  | number  | ✅       | −90 … 90                           |
| `longitude` | number  | ✅       | −180 … 180                         |
| `magType`   | string  | ✅       | `md` `ml` `ms` `mw` `me` `mi` `mb` `mlg` |
| `status`    | string  | ✅       | `automatic` \| `reviewed`          |
| `tsunami`   | boolean | ✅       | `true` \| `false`                  |
| `rms`       | number  | ❌       | ≥ 0                                |
| `gap`       | number  | ❌       | 0 … 360                            |
| `type`      | string  | ✅       | `earthquake` \| `quarry blast` … |
| `net`       | string  | ✅       | `us` `nc` `ak` `uw` … (18 codes)   |
| `time`      | ISO8601 | ✅       | Valid UTC datetime                 |

#### Request Example
```json
POST /earthquakes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "magnitude": 5.2,
  "place": "20 km ESE of Ambon, Indonesia",
  "country": "Indonesia",
  "depth": 50.74,
  "latitude": -3.7458,
  "longitude": 128.3613,
  "magType": "mb",
  "status": "reviewed",
  "tsunami": false,
  "rms": 0.92,
  "gap": 33,
  "type": "earthquake",
  "net": "us",
  "time": "2015-12-28T16:26:04.940Z"
}
```

#### Response — `201 Created`
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Earthquake created successfully.",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0e",
    "magnitude": 5.2,
    "place": "20 km ESE of Ambon, Indonesia",
    "country": "Indonesia",
    "depth": 50.74,
    "latitude": -3.7458,
    "longitude": 128.3613,
    "magType": "mb",
    "status": "reviewed",
    "tsunami": false,
    "time": "2015-12-28T16:26:04.940Z"
  }
}
```

---

### 3.4 Update Earthquake *(Admin)*

`PATCH /earthquakes/:id`  
**Auth:** `Bearer <token>` · **Role:** `admin`

All body fields are **optional** — send only the fields to update.

#### Request Example
```json
PATCH /earthquakes/665f1a2b3c4d5e6f7a8b9c0e
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "status": "reviewed",
  "country": "Indonesia"
}
```

#### Response — `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Earthquake updated successfully.",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0e",
    "status": "reviewed",
    "country": "Indonesia"
  }
}
```

---

### 3.5 Delete Earthquake *(Admin)*

`DELETE /earthquakes/:id`  
**Auth:** `Bearer <token>` · **Role:** `admin`

> Performs a **soft delete** by default (sets `status: "deleted"`).  
> Add `?hard=true` to permanently remove the document.

#### Request Example
```
DELETE /earthquakes/665f1a2b3c4d5e6f7a8b9c0e
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response — `200 OK` (soft delete)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Earthquake deleted (soft) successfully.",
  "data": { "id": "665f1a2b3c4d5e6f7a8b9c0e" }
}
```

---

## 4. Analytics

**Base path:** `/analytics`  
**Rate limit:** 60 req / min · **Auth:** None

All analytics endpoints run MongoDB aggregation pipelines server-side.

---

### 4.1 Global Statistics

`GET /analytics/stats`

Returns five global metrics computed in a **single aggregation round-trip** using `$facet`.

#### Request Example
```
GET /analytics/stats
```

#### Response — `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Global earthquake statistics retrieved successfully.",
  "data": {
    "averageMagnitude": 4.72,
    "averageDepth": 112.34,
    "totalCount": 52,
    "deepestEarthquake": {
      "_id": "665f1a2b3c4d5e6f7a8b9c01",
      "magnitude": 4.5,
      "place": "209 km E of Levuka, Fiji",
      "country": null,
      "depth": 607.86,
      "time": "2015-12-30T12:50:12.930Z",
      "latitude": -18.0505,
      "longitude": -178.7085
    },
    "highestMagnitude": {
      "_id": "665f1a2b3c4d5e6f7a8b9c02",
      "magnitude": 5.8,
      "place": "80 km W of Panguna, Papua New Guinea",
      "country": null,
      "depth": 30.0,
      "time": "2015-12-29T01:51:41.550Z",
      "latitude": -6.2452,
      "longitude": 154.7595
    }
  }
}
```

---

### 4.2 Earthquakes by Country

`GET /analytics/by-country`

Groups all earthquakes by country, sorted by highest count.  
**Pipeline:** `$group → $sort → $project`

#### Request Example
```
GET /analytics/by-country
```

#### Response — `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Country-wise earthquake statistics retrieved successfully.",
  "data": {
    "totalCountries": 24,
    "countries": [
      {
        "country": "Indonesia",
        "earthquakeCount": 8,
        "avgMagnitude": 4.73,
        "maxMagnitude": 5.2
      },
      {
        "country": "Japan",
        "earthquakeCount": 5,
        "avgMagnitude": 4.6,
        "maxMagnitude": 4.87
      }
    ]
  }
}
```

---

### 4.3 Monthly Trends

`GET /analytics/monthly-trends`

Groups earthquakes by year + month, sorted chronologically.  
**Pipeline:** `$group ($year/$month) → $sort → $project`

#### Request Example
```
GET /analytics/monthly-trends
```

#### Response — `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Monthly earthquake trends retrieved successfully.",
  "data": {
    "totalMonths": 3,
    "trends": [
      {
        "year": 2015,
        "month": 12,
        "earthquakeCount": 52,
        "avgMagnitude": 4.72,
        "maxMagnitude": 5.8,
        "monthName": "December",
        "period": "2015-12"
      }
    ]
  }
}
```

---

### 4.4 Highest Magnitude

`GET /analytics/highest-magnitude`

Returns top N earthquakes sorted by magnitude descending.  
**Pipeline:** `$sort → $limit → $project`

#### Query Parameters

| Parameter | Type    | Default | Description                  |
|-----------|---------|---------|------------------------------|
| `limit`   | integer | `10`    | Number of top records to return |

#### Request Example
```
GET /analytics/highest-magnitude?limit=3
```

#### Response — `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Highest magnitude earthquakes retrieved successfully.",
  "data": [
    {
      "_id": "665f1a2b3c4d5e6f7a8b9c02",
      "magnitude": 5.8,
      "place": "80 km W of Panguna, Papua New Guinea",
      "time": "2015-12-29T01:51:41.550Z",
      "depth": 30.0,
      "type": "earthquake",
      "status": "reviewed"
    },
    {
      "_id": "665f1a2b3c4d5e6f7a8b9c03",
      "magnitude": 5.6,
      "place": "20 km WSW of Saint-Pierre, Martinique",
      "time": "2015-12-28T06:55:29.880Z",
      "depth": 150.0,
      "type": "earthquake",
      "status": "reviewed"
    }
  ]
}
```

---

## 5. Error Reference

| Status | Code | Meaning                                      |
|--------|------|----------------------------------------------|
| `400`  | Bad Request | Invalid body, missing required fields, bad ObjectId |
| `401`  | Unauthorized | Missing or expired JWT token              |
| `403`  | Forbidden | Valid token but insufficient role (`admin` required) |
| `404`  | Not Found | Resource does not exist                   |
| `409`  | Conflict | Duplicate key (e.g. email already registered) |
| `422`  | Unprocessable | Joi validation failed on request body  |
| `429`  | Too Many Requests | Rate limit exceeded — see `Retry-After` header |
| `500`  | Internal Server Error | Unexpected server-side error       |

### Validation Error Example — `422`
```json
{
  "success": false,
  "statusCode": 422,
  "message": "Validation failed.",
  "details": [
    "\"magnitude\" must be a number",
    "\"time\" is required"
  ]
}
```

### Rate Limit Error — `429`
```json
{
  "success": false,
  "statusCode": 429,
  "message": "Too many requests. Please slow down and try again later.",
  "retryAfter": 47
}
```

> The `Retry-After` response header also contains the seconds until the window resets.

---

## 6. Rate Limits

| Route prefix  | Window   | Limit       | Strategy         |
|---------------|----------|-------------|------------------|
| `/auth/*`     | 15 min   | 20 requests | Brute-force guard |
| `/analytics/*`| 1 min    | 60 requests | Aggregation cost  |
| `/earthquakes/*` | 1 min | 100 requests | General throttle |

Rate limit headers included in every response:

| Header                  | Description                          |
|-------------------------|--------------------------------------|
| `RateLimit-Limit`       | Max requests allowed in the window   |
| `RateLimit-Remaining`   | Requests remaining in current window |
| `RateLimit-Reset`       | Unix timestamp when window resets    |

---

*Generated: 2026-06-01 · Global Earthquake Analytics API v1.0.0*
