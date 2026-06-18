import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@config/constants';

/**
 * Central route registry.
 *
 * Pages will be imported and registered here as they are built.
 * Example structure (do not add until pages exist):
 *
 *   import LoginPage     from '@pages/auth/LoginPage';
 *   import DashboardPage from '@pages/dashboard/DashboardPage';
 *   import ProtectedRoute from '@components/routing/ProtectedRoute';
 *
 * Route groups:
 *   - Public  : accessible without authentication
 *   - Protected: requires valid JWT token (wrapped in <ProtectedRoute>)
 *   - Admin   : requires admin role
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Temporary root redirect — replace with LandingPage when built */}
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

      {/* ── Public Routes ─────────────────────────────────────────── */}
      {/* <Route path={ROUTES.LOGIN}    element={<LoginPage />} /> */}
      {/* <Route path={ROUTES.REGISTER} element={<RegisterPage />} /> */}

      {/* ── Protected Routes ──────────────────────────────────────── */}
      {/* <Route element={<ProtectedRoute />}> */}
      {/*   <Route path={ROUTES.DASHBOARD}   element={<DashboardPage />} /> */}
      {/*   <Route path={ROUTES.EARTHQUAKES} element={<EarthquakesPage />} /> */}
      {/*   <Route path={ROUTES.ANALYTICS}   element={<AnalyticsPage />} /> */}
      {/*   <Route path={ROUTES.PROFILE}     element={<ProfilePage />} /> */}
      {/* </Route> */}

      {/* ── Catch-All ─────────────────────────────────────────────── */}
      {/* <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} /> */}
    </Routes>
  );
};

export default AppRoutes;
