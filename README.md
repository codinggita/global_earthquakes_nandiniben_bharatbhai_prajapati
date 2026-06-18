# 🌍 Global Earthquake Analytics Dashboard

A full-stack MERN application for analyzing global earthquake data using real-world datasets.  
The project provides advanced REST APIs, authentication, analytics dashboards, filtering systems, aggregation pipelines, and real-time data visualization.

---

# 🚀 Project Overview

The Global Earthquake Analytics Dashboard is an industry-level MERN stack project designed to:

- Manage earthquake records
- Perform advanced filtering and analytics
- Visualize seismic activity
- Implement secure JWT authentication
- Provide admin and user dashboards
- Handle large-scale MongoDB datasets efficiently

This project focuses heavily on:
- Backend architecture
- MongoDB aggregation pipelines
- REST API development
- Dashboard UI systems
- Authentication & authorization
- Performance optimization

---

# 🛠 Tech Stack

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- express-rate-limit
- CORS
- Helmet

## Frontend
- React (Vite)
- Redux Toolkit
- Tailwind CSS
- Material UI (MUI)
- Axios
- Formik
- Yup
- Recharts / Chart.js

---

# 📁 Project Structure

## Backend Structure

```bash
backend/
│
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── utils/
├── validators/
├── data/
│
├── app.js
├── server.js
└── package.json
```

## Frontend Structure

```bash
frontend/
│
├── src/
│   ├── app/
│   ├── components/
│   ├── pages/
│   ├── features/
│   ├── hooks/
│   ├── layouts/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── main.jsx
│
└── package.json
```

---

# 📊 Core Features

# Backend Features

✅ Complete CRUD APIs  
✅ MongoDB Aggregation Pipelines  
✅ JWT Authentication  
✅ Protected Routes  
✅ Role-Based Access Control  
✅ Pagination  
✅ Sorting  
✅ Search Functionality  
✅ Dynamic Filtering  
✅ Middleware Chaining  
✅ Global Error Handling  
✅ Rate Limiting  
✅ Request Validation  
✅ Analytics APIs  
✅ Statistics APIs  
✅ Logging Middleware  
✅ Bulk Operations APIs  
✅ Postman API Documentation  

---

# Frontend Features

✅ Admin Dashboard  
✅ User Dashboard  
✅ JWT Authentication UI  
✅ Responsive Layout  
✅ Analytics Charts  
✅ Dynamic Tables  
✅ CRUD Management System  
✅ Pagination & Search UI  
✅ Protected Routes  
✅ Redux Toolkit State Management  
✅ Dark / Light Theme  
✅ Toast Notifications  
✅ Error & Loading States  
✅ Backend API Integration  
✅ Real-Time Dashboard Data  

---

# 📦 Installation

# 1️⃣ Clone Repository

```bash
git clone <repository-url>
```

---

# 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

JWT_EXPIRE=7d
```

Run backend server:

```bash
npm run dev
```

---

# 3️⃣ Frontend Setup

### Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Node.js | 18.x |
| npm | 9.x |

---

### Install Dependencies

```bash
cd frontend
npm install
```

---

### Environment Variables

Create a `.env` file inside `frontend/` (or copy `.env.example`):

```env
# Backend API base URL — no trailing slash
VITE_API_URL=http://localhost:5000
```

> For production, set `VITE_API_URL` to your deployed Render backend URL.

---

### Run Development Server

```bash
npm run dev
```

Runs at **http://localhost:5173** with HMR enabled.

---

### Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

### Frontend Tech Stack

| Layer | Library / Tool | Version |
|-------|---------------|---------|
| Framework | React | ^19 |
| Build Tool | Vite | ^8 |
| Routing | React Router DOM | ^7 |
| State Management | Redux Toolkit + React-Redux | ^2 / ^9 |
| HTTP Client | Axios | ^1 |
| UI Component Library | Material UI (MUI) | ^9 |
| Utility CSS | Tailwind CSS | ^3 |
| CSS-in-JS (MUI) | Emotion (react + styled) | ^11 |

---

### Frontend Source Structure

```
frontend/
├── public/
└── src/
    ├── app/
    │   └── store.js              # Redux Toolkit store (empty, ready for slices)
    ├── config/
    │   └── constants.js          # Centralized app constants (routes, tokens, etc.)
    ├── features/                 # Feature slices (auth, earthquake, ui — add here)
    ├── services/
    │   └── api/
    │       └── axiosInstance.js  # Axios base instance + interceptors
    ├── routes/
    │   └── index.jsx             # Central route registry (BrowserRouter routes)
    ├── components/               # Shared reusable UI components
    ├── pages/                    # Page-level components
    ├── hooks/                    # Custom React hooks
    ├── layouts/                  # Layout wrappers (sidebar, navbar, etc.)
    ├── utils/                    # Helper utilities
    ├── App.jsx                   # Minimal app shell
    ├── main.jsx                  # Entry point (StrictMode → Provider → Router)
    └── index.css                 # Tailwind directives + CSS design tokens
├── tailwind.config.js            # Tailwind v3 config
├── vite.config.js                # Vite config (aliases, proxy, chunking)
├── .env                          # Local environment variables
└── .env.example                  # Environment variable template
```

---

### Path Aliases

All `@`-prefixed imports resolve via `vite.config.js`:

| Alias | Resolves To |
|-------|-------------|
| `@` | `src/` |
| `@app` | `src/app/` |
| `@config` | `src/config/` |
| `@services` | `src/services/` |
| `@routes` | `src/routes/` |
| `@features` | `src/features/` |
| `@components` | `src/components/` |
| `@pages` | `src/pages/` |
| `@hooks` | `src/hooks/` |
| `@utils` | `src/utils/` |
| `@layouts` | `src/layouts/` |

---


# 🔐 Authentication System

The project includes JWT-based authentication.

## Features

- User Registration
- User Login
- Secure Password Hashing
- Protected Routes
- Role-Based Access
- Token Verification Middleware

---

# 📡 API Features

# CRUD Operations

```http
GET     /earthquakes
GET     /earthquakes/:id
POST    /earthquakes
PATCH   /earthquakes/:id
DELETE  /earthquakes/:id
```

---

# Query Features

```http
GET /earthquakes?page=1&limit=10

GET /earthquakes?sort=magnitude

GET /earthquakes?country=Japan

GET /earthquakes?minMagnitude=5

GET /earthquakes?search=indonesia
```

---

# Analytics APIs

```http
GET /analytics/earthquakes/highest-magnitude

GET /analytics/earthquakes/deepest

GET /analytics/earthquakes/country-analysis

GET /analytics/earthquakes/monthly-analysis
```

---

# 📈 MongoDB Aggregation Features

Implemented aggregation pipelines include:

- Country-wise earthquake analysis
- Monthly earthquake trends
- Magnitude distribution
- Deepest earthquake analysis
- Average magnitude calculations
- Real-time analytics statistics

---

# 🧠 Backend Architecture

The backend follows:

- MVC Architecture
- Service Layer Pattern
- Modular Route System
- Reusable Query Utilities
- Centralized Error Handling
- Middleware-Based Request Flow

---

# ⚡ Performance Optimization

- MongoDB Indexing
- Query Optimization
- Pagination
- Lazy Loading
- Code Splitting
- Optimized Rendering
- Reusable Components

---

# 🧪 Testing

Backend APIs tested using:

- Postman

Frontend tested for:

- Authentication Flow
- CRUD Operations
- Protected Routes
- API Error Handling
- Responsive UI

---

# 🌐 Deployment

## Frontend Deployment
- Vercel

## Backend Deployment
- Render

## Database
- MongoDB Atlas

---

# 📌 Future Improvements

- Real-time earthquake alerts
- WebSocket integration
- AI-based earthquake prediction
- GeoJSON map visualization
- Export reports as PDF/CSV
- Docker deployment
- CI/CD pipeline

---

# 👨‍💻 Author

Developed as a Full Stack MERN Dashboard Project (2026)

---

# 📄 License

This project is for educational and portfolio purposes.
