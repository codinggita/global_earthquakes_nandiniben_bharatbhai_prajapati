const StatCard = ({ title, value, icon, subtext, trend, colorClass = "from-blue-600 to-indigo-600" }) => (
  <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-lg hover:shadow-xl transition-shadow">
    <div className="flex items-start justify-between">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${colorClass} text-white shadow-md`}>
        {icon}
      </div>
      {trend && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    
    <div>
      <h3 className="text-sm font-medium text-slate-400 tracking-wide">{title}</h3>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-3xl font-extrabold text-slate-100">{value}</span>
        {subtext && <span className="text-xs font-semibold text-slate-500">{subtext}</span>}
      </div>
    </div>
  </div>
);

export default StatCard;
