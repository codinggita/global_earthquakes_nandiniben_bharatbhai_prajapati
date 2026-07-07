import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar  from './Navbar';
import { ROUTES } from '@config/constants';

const PAGE_TITLES = {
  [ROUTES.DASHBOARD]:   'Dashboard',
  [ROUTES.EARTHQUAKES]: 'Earthquakes',
  [ROUTES.ANALYTICS]:   'Analytics',
  [ROUTES.PROFILE]:     'Profile',
};

const MainLayout = () => {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? 'Global Earthquake Analytics';

  return (
    <div
      className="flex min-h-screen bg-slate-950"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 20% 50%, rgba(37,99,235,0.06) 0%,transparent 50%),' +
          'radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.05) 0%,transparent 50%),' +
          'radial-gradient(ellipse at 60% 80%, rgba(6,182,212,0.04) 0%,transparent 50%)',
      }}
    >
      <Sidebar />

      {/* Content area — offset by sidebar width */}
      <div className="flex flex-col flex-1 ml-[260px] min-w-0">
        <Navbar title={title} />
        <main id="main-content" className="flex-1 p-7 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
