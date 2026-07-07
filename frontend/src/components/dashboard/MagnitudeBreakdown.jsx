const MagnitudeBreakdown = ({ data = [], loading = false }) => {
  // Aggregate magnitude breakdown based on recent data
  // Using typical magnitude scales
  const breakdown = {
    Micro: 0,    // 0-2
    Minor: 0,    // 2-4
    Moderate: 0, // 4-6
    Strong: 0,   // 6+
  };

  data.forEach((eq) => {
    const m = eq.magnitude;
    if (m < 2) breakdown.Micro++;
    else if (m < 4) breakdown.Minor++;
    else if (m < 6) breakdown.Moderate++;
    else breakdown.Strong++;
  });

  const total = data.length || 1; // Prevent divide by zero

  const bars = [
    { label: 'Micro', count: breakdown.Micro, color: 'bg-slate-500', width: `${(breakdown.Micro / total) * 100}%` },
    { label: 'Minor', count: breakdown.Minor, color: 'bg-blue-500', width: `${(breakdown.Minor / total) * 100}%` },
    { label: 'Moderate', count: breakdown.Moderate, color: 'bg-amber-500', width: `${(breakdown.Moderate / total) * 100}%` },
    { label: 'Strong+', count: breakdown.Strong, color: 'bg-red-500', width: `${(breakdown.Strong / total) * 100}%` },
  ];

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-base font-bold text-slate-100 mb-5">Magnitude Breakdown</h3>

      {loading ? (
        <div className="flex justify-center py-6"><span className="spinner border-t-blue-500"></span></div>
      ) : data.length === 0 ? (
        <div className="text-center py-6 text-slate-500 text-sm">No data available</div>
      ) : (
        <div className="flex flex-col gap-4">
          {bars.map((bar) => (
            <div key={bar.label}>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">{bar.label}</span>
                <span className="text-slate-400">{bar.count}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${bar.color} transition-all duration-1000 ease-out`}
                  style={{ width: bar.width }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MagnitudeBreakdown;
