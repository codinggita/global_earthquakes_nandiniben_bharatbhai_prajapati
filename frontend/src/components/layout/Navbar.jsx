import { APP_NAME } from '@config/constants';
import './Navbar.css';

/**
 * Navbar — top header bar displayed inside the main app layout.
 * Shows page title (injected via prop), a global search hint,
 * and a live seismic pulse indicator.
 */
const Navbar = ({ title = 'Dashboard' }) => {
  const now = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month:   'short',
    day:     'numeric',
    year:    'numeric',
  });

  return (
    <header className="navbar" role="banner" id="top-navbar">
      {/* ── Left: page title ─────────────────────────────── */}
      <div className="navbar-left">
        <h1 className="navbar-title">{title}</h1>
        <span className="navbar-date">{now}</span>
      </div>

      {/* ── Right: status + app name ─────────────────────── */}
      <div className="navbar-right">
        <div className="navbar-live-badge" title="Live seismic monitoring">
          <span className="pulse-dot" />
          <span>Live</span>
        </div>
        <span className="navbar-app-name">{APP_NAME}</span>
      </div>
    </header>
  );
};

export default Navbar;
