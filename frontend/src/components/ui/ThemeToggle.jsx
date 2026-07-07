import useTheme from '@hooks/useTheme';

const ThemeToggle = () => {
  const { theme, setAppTheme } = useTheme();

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-slate-300">Theme</span>
      <div className="flex p-1 bg-slate-900 border border-slate-700/60 rounded-lg">
        <button
          onClick={() => setAppTheme('light')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
            theme === 'light' 
              ? 'bg-blue-500/20 text-blue-400 shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Light
        </button>
        <button
          onClick={() => setAppTheme('dark')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
            theme === 'dark' 
              ? 'bg-blue-500/20 text-blue-400 shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Dark
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;
