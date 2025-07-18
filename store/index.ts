import { configureStore } from '@reduxjs/toolkit';
import storyReducer from './slices/storySlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    story: storyReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;