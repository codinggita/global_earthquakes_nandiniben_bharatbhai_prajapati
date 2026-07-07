# Global Earthquake Analytics Dashboard

A modern, full-stack responsive dashboard application for monitoring, analyzing, and managing global earthquake data. Built with a robust MERN stack and an interactive, beautifully designed React frontend.

## 🚀 Features

- **Real-Time Data Dashboard:** Monitor the latest events, top-level metrics, and critical earthquake incidents immediately.
- **Interactive Analytics:** View detailed data visualizations (trends over time, type distribution, country breakdown) powered by Recharts.
- **Full CRUD Management:** A dedicated paginated data table allowing authorized users to search, filter, edit, and delete seismic records.
- **Authentication:** Secure JWT-based login and registration system.
- **Dynamic Theming:** Built-in Light/Dark mode toggle synced with local storage.
- **Modern UI:** Built exclusively with Tailwind CSS featuring glassmorphism, smooth animations, and a responsive design system.

## 🛠️ Technology Stack

**Frontend:**
- **Core:** React 19, Vite
- **State Management:** Redux Toolkit
- **Routing:** React Router (Lazy loaded chunks)
- **Styling:** Tailwind CSS (Custom CSS Variables)
- **Forms & Validation:** Formik, Yup
- **Data Visualization:** Recharts
- **SEO & Stability:** React Helmet Async, React Error Boundaries

**Backend:**
- **Core:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Security:** bcrypt, jsonwebtoken, express-rate-limit

## 📦 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB URI

### 1. Backend Setup
1. Navigate to the `server` directory.
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=30d
   ```
4. Start the backend server: `npm run dev`

### 2. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Create a `.env` file (if necessary, default proxy handles localhost:5000).
4. Start the Vite dev server: `npm run dev`

### 3. Build for Production
Run `npm run build` in the `frontend` directory. The output will be located in `dist/`, fully code-split and optimized for deployment.

## 🗂️ Project Structure (Frontend)
```
frontend/
├── public/                 # Static assets, robots.txt, sitemap
├── src/
│   ├── app/                # Redux store setup
│   ├── components/         # Reusable UI components by feature
│   ├── config/             # Constants and app config
│   ├── features/           # Redux slices (auth, ui, earthquake)
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Route entry pages (lazy loaded)
│   ├── routes/             # App routing and protection logic
│   ├── services/api/       # Axios API integrations
│   ├── App.jsx             # Shell component
│   ├── index.css           # Global Tailwind directives
│   └── main.jsx            # React root and providers
└── vite.config.js          # Vite configuration and proxy
```

## 📜 License
This project is for educational/demo purposes.
