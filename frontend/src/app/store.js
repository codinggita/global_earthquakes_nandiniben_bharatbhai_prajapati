import { configureStore } from '@reduxjs/toolkit';

/**
 * Redux Toolkit store — foundation only.
 *
 * Feature slices will be added here as the application grows:
 *   import authReducer      from '@features/auth/authSlice';
 *   import earthquakeReducer from '@features/earthquake/earthquakeSlice';
 *   import uiReducer        from '@features/ui/uiSlice';
 *
 * Middleware extensions (e.g. logger) also go in the middleware array.
 */
const store = configureStore({
  reducer: {
    // Feature reducers will be registered here
    // auth:       authReducer,
    // earthquake: earthquakeReducer,
    // ui:         uiReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in specific action/state paths
        ignoredActions: [],
        ignoredPaths: [],
      },
    }),

  devTools: import.meta.env.MODE !== 'production',
});

export default store;
