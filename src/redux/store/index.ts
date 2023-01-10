import { configureStore } from '@reduxjs/toolkit';
import { schedulerApi } from 'redux/services/schedulerApi';
import { toastSlice } from 'redux/slices/toastSlice';

export const store = configureStore({
  reducer: {
    [schedulerApi.reducerPath]: schedulerApi.reducer,
    toast: toastSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(schedulerApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>; // A global type to access reducers types
export type AppDispatch = typeof store.dispatch; // Type to access dispatch
