import { APP_NAME } from '@config/constants';

const Navbar = ({ title = 'Dashboard' }) => {
  const now = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <header
      id="top-navbar"
      role="banner"
      className="sticky top-0 z-40 h-16 flex items-center justify-between px-6
                 bg-slate-950/85 border-b border-slate-800/50 backdrop-blur-xl"
    >
      {/* Left: page title */}
      <div className="flex flex-col gap-0.5">
        <h1 className="text-lg font-bold text-slate-100 tracking-tight leading-none">{title}</h1>
        <span className="text-[0.65rem] text-slate-500 tracking-wide">{now}</span>
      </div>

      {/* Right: live badge + app name */}
      <div className="flex items-center gap-5">
        <div
          title="Live seismic monitoring"
          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400
                     bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full"
        >
          <span className="pulse-dot" />
          Live
        </div>
        <span className="text-xs text-slate-500 font-medium hidden sm:block">{APP_NAME}</span>
      </div>
    </header>
  );
};

export default Navbar;
