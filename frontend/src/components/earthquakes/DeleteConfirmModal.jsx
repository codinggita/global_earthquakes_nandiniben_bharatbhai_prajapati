const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, loading, item }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl p-6 animate-fade-in-up">
        
        <div className="flex items-center gap-4 text-red-500 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-100">Delete Earthquake?</h3>
        </div>

        <p className="text-slate-400 text-sm mb-6">
          Are you sure you want to delete the earthquake event at <strong className="text-slate-200">{item?.place}</strong>? 
          This action cannot be undone.
        </p>

        <div className="flex items-center gap-3 justify-end mt-6">
          <button 
            type="button" 
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={() => onConfirm(item?._id || item?.id)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-red-600/20 disabled:opacity-50"
          >
            {loading ? <span className="spinner w-4 h-4"></span> : 'Yes, delete event'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
