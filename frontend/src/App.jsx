import AppRoutes     from '@routes';
import ToastContainer from '@components/ui/Toast';

/**
 * App.jsx — Application shell.
 * Renders route registry + global UI layers (toasts).
 */
const App = () => (
  <>
    <AppRoutes />
    <ToastContainer />
  </>
);

export default App;
