import AppRoutes from '@routes';

/**
 * App.jsx — Minimal application shell.
 *
 * Responsibilities:
 *   - Renders the central route registry (AppRoutes)
 *
 * Future additions (add here as features are built):
 *   - <ThemeProvider>      — MUI theme context
 *   - <ToastContainer>     — global toast notifications
 *   - <ErrorBoundary>      — top-level error catching
 *   - Layout wrappers      — persistent nav / sidebar
 */
const App = () => {
  return <AppRoutes />;
};

export default App;
