import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const CountryChart = ({ data, loading }) => {
  // Backend returns: [{ country, earthquakeCount, maxMagnitude, avgMagnitude }]
  const formattedData = Array.isArray(data) ? data
    .map(item => ({
      name: item.country || item._id || item.name || 'Unknown',
      count: item.earthquakeCount || item.count || item.value || 0,
      avgMag: item.avgMagnitude || 0,
    }))
    .filter(item => item.name && item.name !== 'Unknown' && item.name !== 'null')
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) : [];

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-lg h-full flex flex-col">
      <h3 className="text-base font-bold text-slate-100 mb-6">Top 10 Affected Countries</h3>
      <div className="flex-1 w-full min-h-[300px]">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <span className="spinner border-t-emerald-500"></span>
          </div>
        ) : formattedData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
            No country data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={80} />
              <Tooltip 
                cursor={{ fill: '#334155', opacity: 0.4 }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                itemStyle={{ color: '#10b981' }}
              />
              <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default CountryChart;
