import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@features/auth/authSlice';
import uiReducer   from '@features/ui/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui:   uiReducer,
    // earthquake: earthquakeReducer  ← added in Batch 3
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
        ignoredPaths:   [],
      },
    }),

  devTools: import.meta.env.MODE !== 'production',
});

export default store;
