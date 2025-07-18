import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProgress, UserState } from '@/types/Story';

const initialState: UserState = {
  progress: [],
  settings: {
    fontSize: 'medium',
    theme: 'dark',
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProgress: (state, action: PayloadAction<UserProgress[]>) => {
      state.progress = action.payload;
    },
    updateStoryProgress: (state, action: PayloadAction<UserProgress>) => {
      const existingIndex = state.progress.findIndex(p => p.storyId === action.payload.storyId);
      if (existingIndex !== -1) {
        state.progress[existingIndex] = action.payload;
      } else {
        state.progress.push(action.payload);
      }
    },
    updateSettings: (state, action: PayloadAction<Partial<UserState['settings']>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    resetProgress: (state, action: PayloadAction<string>) => {
      state.progress = state.progress.filter(p => p.storyId !== action.payload);
    },
  },
});

export const { setUserProgress, updateStoryProgress, updateSettings, resetProgress } = userSlice.actions;
export default userSlice.reducer;