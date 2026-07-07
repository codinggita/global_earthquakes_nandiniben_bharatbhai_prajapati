import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const TypeDistribution = ({ data, loading }) => {
  const formattedData = Array.isArray(data) ? data.map(item => ({
    name: item._id || item.name || 'Unknown',
    value: item.count || item.value || 0
  })).sort((a, b) => b.value - a.value) : [];

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#64748b'];

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-lg h-full flex flex-col">
      <h3 className="text-base font-bold text-slate-100 mb-6">Event Type Distribution</h3>
      <div className="flex-1 w-full min-h-[250px]">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <span className="spinner border-t-purple-500"></span>
          </div>
        ) : formattedData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
            No type distribution data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TypeDistribution;
