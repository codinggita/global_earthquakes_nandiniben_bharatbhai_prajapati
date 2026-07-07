import { createSlice } from '@reduxjs/toolkit';

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  theme: localStorage.getItem('eq_theme') || 'dark',
  toasts: [],          // [{ id, message, type: 'success'|'error'|'warning'|'info' }]
  globalLoading: false,
};

let toastId = 0;

// ─── Slice ────────────────────────────────────────────────────────────────────
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // ── Theme ──────────────────────────────────────────────────────────────
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('eq_theme', state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('eq_theme', action.payload);
    },

    // ── Toasts ─────────────────────────────────────────────────────────────
    addToast: (state, action) => {
      state.toasts.push({
        id: ++toastId,
        message: action.payload.message,
        type: action.payload.type || 'info',
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },

    // ── Global loading ──────────────────────────────────────────────────────
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  addToast,
  removeToast,
  clearToasts,
  setGlobalLoading,
} = uiSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectTheme         = (state) => state.ui.theme;
export const selectToasts        = (state) => state.ui.toasts;
export const selectGlobalLoading = (state) => state.ui.globalLoading;

// ─── Toast helpers (dispatch-ready) ──────────────────────────────────────────
export const toastSuccess = (message) => addToast({ message, type: 'success' });
export const toastError   = (message) => addToast({ message, type: 'error' });
export const toastWarning = (message) => addToast({ message, type: 'warning' });
export const toastInfo    = (message) => addToast({ message, type: 'info' });

export default uiSlice.reducer;
