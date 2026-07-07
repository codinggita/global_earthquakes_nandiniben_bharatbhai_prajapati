const ActivityFeed = ({ data = [], loading = false }) => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl flex flex-col shadow-lg p-6 h-full">
      <h3 className="text-base font-bold text-slate-100 mb-5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        Critical Events
      </h3>

      <div className="flex-1 overflow-auto pr-2 custom-scrollbar space-y-4">
        {loading ? (
          <div className="flex justify-center py-10"><span className="spinner border-t-red-500"></span></div>
        ) : data.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">No critical events recently</div>
        ) : (
          data.slice(0, 6).map((eq) => (
            <div key={eq._id || eq.id} className="flex gap-4 border-l-2 border-red-500/50 pl-4 py-1 relative before:absolute before:-left-[5px] before:top-2 before:w-2 before:h-2 before:bg-red-500 before:rounded-full">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate" title={eq.place}>{eq.place}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span className="text-red-400 font-bold">Mag {eq.magnitude.toFixed(1)}</span>
                  <span>•</span>
                  <span>{new Date(eq.time).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
