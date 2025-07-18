export interface Choice {
  id: string;
  text: string;
  nextChapterId: string;
  popularity?: number;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  choices: Choice[];
  isEnding?: boolean;
  endingType?: 'good' | 'bad' | 'neutral';
}

export interface Story {
  id: string;
  title: string;
  description: string;
  author: string;
  coverImage: string;
  chapters: Chapter[];
  estimatedReadTime: number;
}

export interface UserProgress {
  storyId: string;
  currentChapterId: string;
  choiceHistory: Array<{
    chapterId: string;
    choiceId: string;
    timestamp: number;
  }>;
  isCompleted: boolean;
  completedAt?: number;
  endingType?: string;
}

export interface UserState {
  progress: UserProgress[];
  settings: {
    fontSize: 'small' | 'medium' | 'large';
    theme: 'light' | 'dark';
  };
}