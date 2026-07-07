import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectToasts, removeToast } from '@features/ui/uiSlice';

const ICONS   = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
const STYLES  = {
  success: 'bg-green-900/30 border-green-500/30 text-green-300',
  error:   'bg-red-900/30   border-red-500/30   text-red-300',
  warning: 'bg-amber-900/30 border-amber-500/30 text-amber-300',
  info:    'bg-blue-900/30  border-blue-500/30  text-blue-300',
};
const ICON_BG = {
  success: 'bg-green-500/20 text-green-400',
  error:   'bg-red-500/20   text-red-400',
  warning: 'bg-amber-500/20 text-amber-400',
  info:    'bg-blue-500/20  text-blue-400',
};

const AUTO_DISMISS_MS = 4000;

const ToastItem = ({ toast }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const t = setTimeout(() => dispatch(removeToast(toast.id)), AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [dispatch, toast.id]);

  return (
    <div
      role="alert"
      className={`toast-enter flex items-center gap-3 px-4 py-3.5 rounded-xl border
                  backdrop-blur-lg shadow-xl text-sm font-medium ${STYLES[toast.type]}`}
    >
      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${ICON_BG[toast.type]}`}>
        {ICONS[toast.type]}
      </span>
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button
        aria-label="Close notification"
        onClick={() => dispatch(removeToast(toast.id))}
        className="opacity-50 hover:opacity-100 text-base leading-none transition-opacity flex-shrink-0"
      >
        ×
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const toasts = useSelector(selectToasts);
  if (!toasts.length) return null;

  return (
    <div
      id="toast-container"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 w-[360px] max-w-[calc(100vw-2rem)]"
    >
      {toasts.map((t) => <ToastItem key={t.id} toast={t} />)}
    </div>
  );
};

export default ToastContainer;
