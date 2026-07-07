import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@features/auth/authSlice';
import { ROUTES } from '@config/constants';

/**
 * ProtectedRoute — Renders child routes only when the user is authenticated.
 * Unauthenticated users are redirected to /login, with the original path
 * stored in location state so LoginPage can redirect back after login.
 */
const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
