import { configureStore } from '@reduxjs/toolkit';
import radioReducer from './radioSlice';

export const store = configureStore({
  reducer: {
    radio: radioReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;