import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@features/auth/authSlice';
import uiReducer   from '@features/ui/uiSlice';
import earthquakeReducer from '@features/earthquake/earthquakeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui:   uiReducer,
    earthquake: earthquakeReducer,
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
