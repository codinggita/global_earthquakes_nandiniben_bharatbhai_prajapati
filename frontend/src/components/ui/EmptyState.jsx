const EmptyState = ({ 
  title = "No data found", 
  message = "Try adjusting your filters or search terms.", 
  actionLabel, 
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-700/50 rounded-2xl bg-slate-900/20 w-full">
      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-sm">{message}</p>
      
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
