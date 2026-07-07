const EarthquakeTable = ({ data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap">
        <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
          <tr>
            <th className="px-6 py-4 font-semibold">Location</th>
            <th className="px-6 py-4 font-semibold">Mag</th>
            <th className="px-6 py-4 font-semibold hidden md:table-cell">Depth</th>
            <th className="px-6 py-4 font-semibold">Time</th>
            <th className="px-6 py-4 font-semibold hidden lg:table-cell">Status</th>
            <th className="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {data.map((eq) => (
            <tr key={eq._id || eq.id} className="hover:bg-slate-800/30 transition-colors group">
              <td className="px-6 py-4 font-medium text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500/50 block"></span>
                  <span className="truncate max-w-[250px]" title={eq.place}>{eq.place}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center justify-center px-2 py-1 rounded font-bold text-xs ${
                  eq.magnitude >= 6 ? 'bg-red-500/20 text-red-400' : 
                  eq.magnitude >= 4.5 ? 'bg-amber-500/20 text-amber-400' : 
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {eq.magnitude.toFixed(1)}
                </span>
              </td>
              <td className="px-6 py-4 hidden md:table-cell text-slate-400">
                {eq.depth.toFixed(1)} km
              </td>
              <td className="px-6 py-4 text-slate-400">
                {new Date(eq.time).toLocaleString(undefined, { 
                  month: 'short', day: 'numeric', year: 'numeric', 
                  hour: '2-digit', minute: '2-digit'
                })}
              </td>
              <td className="px-6 py-4 hidden lg:table-cell">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider border ${
                  eq.status === 'reviewed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                  'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}>
                  {eq.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEdit(eq)}
                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-md transition-colors"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => onDelete(eq)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EarthquakeTable;
