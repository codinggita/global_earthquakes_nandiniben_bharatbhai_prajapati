import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@config/constants';

import ProtectedRoute from '@components/routing/ProtectedRoute';
import MainLayout     from '@components/layout/MainLayout';

// ── Public pages (eager — small, needed immediately) ──────────────────────────
import LoginPage    from '@pages/auth/LoginPage';
import RegisterPage from '@pages/auth/RegisterPage';

// ── Protected pages (lazy — loaded only when authenticated) ───────────────────
const DashboardPage   = lazy(() => import('@pages/dashboard/DashboardPage'));
const EarthquakesPage = lazy(() => import('@pages/earthquakes/EarthquakesPage'));
const AnalyticsPage   = lazy(() => import('@pages/analytics/AnalyticsPage'));
const ProfilePage     = lazy(() => import('@pages/profile/ProfilePage'));

// ── Fallback while lazy chunk is loading ──────────────────────────────────────
const PageLoader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '60vh', color: 'var(--color-text-muted)', fontSize: '0.9rem',
    gap: '0.75rem',
  }}>
    <span className="spinner" style={{ borderTopColor: 'var(--color-primary)' }} />
    Loading…
  </div>
);

// ── Route registry ─────────────────────────────────────────────────────────────
const AppRoutes = () => (
  <Routes>
    {/* Root → Dashboard (redirects to login if not authenticated) */}
    <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

    {/* ── Public routes ──────────────────────────────────────────────────── */}
    <Route path={ROUTES.LOGIN}    element={<LoginPage />} />
    <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

    {/* ── Protected routes (JWT required) ────────────────────────────────── */}
    <Route element={<ProtectedRoute />}>
      <Route element={<MainLayout />}>
        <Route
          path={ROUTES.DASHBOARD}
          element={<Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>}
        />
        <Route
          path={ROUTES.EARTHQUAKES}
          element={<Suspense fallback={<PageLoader />}><EarthquakesPage /></Suspense>}
        />
        <Route
          path={ROUTES.ANALYTICS}
          element={<Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense>}
        />
        <Route
          path={ROUTES.PROFILE}
          element={<Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>}
        />
      </Route>
    </Route>

    {/* ── 404 catch-all ──────────────────────────────────────────────────── */}
    <Route path={ROUTES.NOT_FOUND} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
  </Routes>
);

export default AppRoutes;
