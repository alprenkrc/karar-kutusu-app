import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Story, Chapter } from '@/types/Story';
import storiesData from '@/data/stories.json';

interface StoryState {
  stories: Story[];
  currentStory: Story | null;
  currentChapter: Chapter | null;
  isLoading: boolean;
}

const initialState: StoryState = {
  stories: storiesData.stories as Story[],
  currentStory: null,
  currentChapter: null,
  isLoading: false,
};

export const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setCurrentStory: (state, action: PayloadAction<string>) => {
      const story = state.stories.find(s => s.id === action.payload);
      if (story) {
        state.currentStory = story;
        state.currentChapter = story.chapters[0];
      }
    },
    setCurrentChapter: (state, action: PayloadAction<string>) => {
      if (state.currentStory) {
        const chapter = state.currentStory.chapters.find(c => c.id === action.payload);
        if (chapter) {
          state.currentChapter = chapter;
        }
      }
    },
    clearCurrentStory: (state) => {
      state.currentStory = null;
      state.currentChapter = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCurrentStory, setCurrentChapter, clearCurrentStory, setLoading } = storySlice.actions;
export default storySlice.reducer;