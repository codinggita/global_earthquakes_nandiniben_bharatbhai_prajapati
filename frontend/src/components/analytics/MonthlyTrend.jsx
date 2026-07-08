import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const MonthlyTrend = ({ data, loading }) => {
  // Backend returns: [{ earthquakeCount, maxMagnitude, year, month, avgMagnitude, monthName, period }]
  const formattedData = Array.isArray(data) ? data.map(item => ({
    name: item.monthName
      ? `${item.monthName.slice(0, 3)} ${item.year}`   // "Dec 2015"
      : item.period || item.name || 'Unknown',
    count: item.earthquakeCount || item.count || item.value || 0,
    avgMag: item.avgMagnitude || 0,
  })) : [];

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-lg h-full flex flex-col">
      <h3 className="text-base font-bold text-slate-100 mb-6">Monthly Event Trend</h3>
      <div className="flex-1 w-full min-h-[250px]">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <span className="spinner border-t-blue-500"></span>
          </div>
        ) : formattedData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
            No monthly trend data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: '#334155', opacity: 0.4 }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                itemStyle={{ color: '#3b82f6' }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default MonthlyTrend;
