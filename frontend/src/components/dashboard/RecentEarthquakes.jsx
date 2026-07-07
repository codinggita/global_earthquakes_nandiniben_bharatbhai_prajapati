import { Link } from 'react-router-dom';
import { ROUTES } from '@config/constants';

const RecentEarthquakes = ({ data = [], loading = false }) => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl flex flex-col shadow-lg overflow-hidden h-full">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/60">
        <h3 className="text-base font-bold text-slate-100">Recent Earthquakes</h3>
        <Link to={ROUTES.EARTHQUAKES} className="text-sm font-semibold text-blue-400 hover:text-blue-300">
          View all →
        </Link>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex justify-center py-10"><span className="spinner border-t-blue-500"></span></div>
        ) : data.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">No recent data</div>
        ) : (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-semibold">Place</th>
                <th className="px-6 py-3 font-semibold">Mag</th>
                <th className="px-6 py-3 font-semibold">Depth</th>
                <th className="px-6 py-3 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.slice(0, 5).map((eq) => (
                <tr key={eq._id || eq.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-3.5 text-slate-200 truncate max-w-[200px]" title={eq.place}>{eq.place}</td>
                  <td className="px-6 py-3.5 font-bold">
                    <span className={`px-2 py-1 rounded-md text-xs ${eq.magnitude >= 6 ? 'bg-red-500/20 text-red-400' : eq.magnitude >= 4.5 ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {eq.magnitude.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-400">{eq.depth.toFixed(1)} km</td>
                  <td className="px-6 py-3.5 text-slate-500 text-xs">
                    {new Date(eq.time).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecentEarthquakes;
