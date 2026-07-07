import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES } from '@config/constants';
import { logoutUser, selectUser } from '@features/auth/authSlice';

const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD,   icon: '⚡', label: 'Dashboard'  },
  { to: ROUTES.EARTHQUAKES, icon: '🗺️', label: 'Earthquakes' },
  { to: ROUTES.ANALYTICS,   icon: '📊', label: 'Analytics'   },
  { to: ROUTES.PROFILE,     icon: '👤', label: 'Profile'     },
  { to: ROUTES.SETTINGS,    icon: '⚙️', label: 'Settings'    },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user     = useSelector(selectUser);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <aside
      id="sidebar"
      className="fixed top-0 left-0 bottom-0 w-[260px] z-50 flex flex-col px-3 py-5
                 bg-slate-950/95 border-r border-slate-800/50 backdrop-blur-xl"
    >
      {/* ── Brand ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-3 pb-5 mb-4 border-b border-slate-800/40">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0
                        bg-gradient-to-br from-blue-600 to-violet-700 shadow-lg shadow-blue-700/40">
          🌍
        </div>
        <div>
          <span className="block text-sm font-bold text-slate-100 tracking-tight">EarthWatch</span>
          <span className="block text-[0.65rem] text-slate-500 uppercase tracking-widest">Analytics</span>
        </div>
      </div>

      {/* ── Nav links ──────────────────────────────────────── */}
      <nav className="flex-1 flex flex-col gap-1" aria-label="Main navigation">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            id={`nav-${label.toLowerCase()}`}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
               transition-all duration-200 no-underline
               ${isActive
                 ? 'bg-blue-600/20 text-blue-400 before:absolute before:left-0 before:top-[20%] before:bottom-[20%] before:w-0.5 before:bg-gradient-to-b before:from-blue-400 before:to-violet-500 before:rounded-r'
                 : 'text-slate-400 hover:bg-blue-600/10 hover:text-slate-200'}`
            }
          >
            <span className="text-base w-5 text-center flex-shrink-0">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Footer ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-800/40">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
                          text-xs font-bold text-white
                          bg-gradient-to-br from-blue-600 to-violet-700">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">{user?.name ?? 'User'}</p>
            <p className="text-[0.65rem] text-slate-500 truncate">{user?.email ?? ''}</p>
          </div>
        </div>
        <button
          id="btn-logout"
          onClick={handleLogout}
          title="Logout"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500
                     hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 flex-shrink-0"
        >
          ↩
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
