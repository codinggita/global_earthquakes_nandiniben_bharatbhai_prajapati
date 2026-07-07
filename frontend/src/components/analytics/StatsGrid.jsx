const StatsGrid = ({ summary, loading }) => {
  const stats = [
    { label: "Total Events", value: summary.count?.toLocaleString() || "0", prefix: "" },
    { label: "Highest Magnitude", value: summary.highestMag?.toFixed(1) || "0.0", prefix: "M " },
    { label: "Avg Magnitude", value: summary.avgMag?.toFixed(2) || "0.0", prefix: "M " },
    { label: "Avg Depth", value: summary.avgDepth?.toFixed(1) || "0", prefix: "", suffix: " km" },
    { label: "Deepest Event", value: summary.deepest?.toFixed(1) || "0", prefix: "", suffix: " km" },
    { label: "Reviewed Events", value: summary.reviewed?.toLocaleString() || "0", prefix: "" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-4 flex flex-col justify-center items-center text-center shadow-lg hover:bg-slate-800/40 transition-colors">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{stat.label}</span>
          {loading ? (
            <div className="h-8 w-16 bg-slate-800 rounded animate-pulse my-1"></div>
          ) : (
            <span className="text-2xl font-bold text-slate-100">
              <span className="text-slate-500 text-lg">{stat.prefix}</span>
              {stat.value}
              <span className="text-slate-500 text-sm ml-1">{stat.suffix}</span>
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
