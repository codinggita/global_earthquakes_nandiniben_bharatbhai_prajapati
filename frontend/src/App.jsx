import AppRoutes     from '@routes';
import ToastContainer from '@components/ui/Toast';
import ErrorBoundary  from '@components/ui/ErrorBoundary';
import useTheme       from '@hooks/useTheme';

/**
 * App.jsx — Application shell.
 * Renders route registry + global UI layers (toasts, error boundary).
 */
const App = () => {
  useTheme(); // Mount hook so it listens to theme changes

  return (
    <ErrorBoundary>
      <AppRoutes />
      <ToastContainer />
    </ErrorBoundary>
  );
};

export default App;
