import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, UserState } from '@/types/Story';

const STORAGE_KEYS = {
  USER_PROGRESS: '@decision_box_progress',
  USER_SETTINGS: '@decision_box_settings',
};

export const StorageService = {
  async saveUserProgress(progress: UserProgress[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save user progress:', error);
    }
  },

  async loadUserProgress(): Promise<UserProgress[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load user progress:', error);
      return [];
    }
  },

  async saveUserSettings(settings: UserState['settings']): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save user settings:', error);
    }
  },

  async loadUserSettings(): Promise<UserState['settings'] | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load user settings:', error);
      return null;
    }
  },

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.USER_PROGRESS, STORAGE_KEYS.USER_SETTINGS]);
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  },
};