import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar  from './Navbar';
import { ROUTES } from '@config/constants';
import './MainLayout.css';

/** Maps route paths → human-readable page titles for the Navbar */
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
    <div className="main-layout">
      <Sidebar />
      <div className="main-layout-body">
        <Navbar title={title} />
        <main className="main-layout-content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
