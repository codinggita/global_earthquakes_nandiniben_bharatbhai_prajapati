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

```bash
cd frontend
npm install
```

Run frontend:

```bash
npm run dev
```

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
