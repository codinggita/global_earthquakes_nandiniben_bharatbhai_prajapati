const SkeletonLoader = ({ count = 5 }) => {
  return (
    <div className="w-full">
      <div className="animate-pulse flex flex-col gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-800/60 last:border-0">
            <div className="h-4 bg-slate-800 rounded w-1/4"></div>
            <div className="h-4 bg-slate-800 rounded w-1/6"></div>
            <div className="h-4 bg-slate-800 rounded w-1/6"></div>
            <div className="h-4 bg-slate-800 rounded w-1/4"></div>
            <div className="h-4 bg-slate-800 rounded w-[10%]"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
