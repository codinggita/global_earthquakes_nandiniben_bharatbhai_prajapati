import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES } from '@config/constants';
import { logoutUser, selectUser } from '@features/auth/authSlice';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD,   icon: '⚡', label: 'Dashboard'   },
  { to: ROUTES.EARTHQUAKES, icon: '🗺️', label: 'Earthquakes'  },
  { to: ROUTES.ANALYTICS,   icon: '📊', label: 'Analytics'    },
  { to: ROUTES.PROFILE,     icon: '👤', label: 'Profile'      },
];

const Sidebar = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const user      = useSelector(selectUser);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <aside className="sidebar" id="sidebar">
      {/* ── Brand ──────────────────────────────────────────── */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">🌍</div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">EarthWatch</span>
          <span className="sidebar-brand-sub">Analytics</span>
        </div>
      </div>

      {/* ── Nav links ──────────────────────────────────────── */}
      <nav className="sidebar-nav" aria-label="Main navigation">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' active' : ''}`
            }
            id={`nav-${label.toLowerCase()}`}
          >
            <span className="sidebar-link-icon">{icon}</span>
            <span className="sidebar-link-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom: user + logout ───────────────────────────── */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user?.name ?? 'User'}</p>
            <p className="sidebar-user-email">{user?.email ?? ''}</p>
          </div>
        </div>
        <button
          id="btn-logout"
          className="btn btn-ghost btn-icon sidebar-logout"
          onClick={handleLogout}
          title="Logout"
        >
          ↩
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
