import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Provider } from 'react-redux';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { store } from '@/store';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { setUserProgress, updateSettings } from '@/store/slices/userSlice';
import { StorageService } from '@/utils/storage';
import { BookOpen, Clock, User } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Theme definitions (consistent with settings.tsx)
const themes = {
  light: {
    background: '#ffffff',
    cardBackground: '#f8fafc',
    cardBorder: '#e2e8f0',
    titleText: '#1e293b',
    primaryText: '#334155',
    secondaryText: '#64748b',
    tertiaryText: '#94a3b8',
    accentColor: '#f59e0b',
  },
  dark: {
    background: '#0f172a',
    cardBackground: '#1e293b',
    cardBorder: '#334155',
    titleText: '#ffffff',
    primaryText: '#ffffff',
    secondaryText: '#cbd5e1',
    tertiaryText: '#94a3b8',
    accentColor: '#f59e0b',
  },
};

function StoryListScreen() {
  const dispatch = useAppDispatch();
  const { stories } = useAppSelector(state => state.story);
  const { progress, settings } = useAppSelector(state => state.user);
  const router = useRouter();
  
  // Get current theme colors
  const currentTheme = themes[settings.theme];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const savedProgress = await StorageService.loadUserProgress();
    const savedSettings = await StorageService.loadUserSettings();
    
    dispatch(setUserProgress(savedProgress));
    if (savedSettings) {
      dispatch(updateSettings(savedSettings));
    }
  };

  const getStoryProgress = (storyId: string) => {
    return progress.find(p => p.storyId === storyId);
  };

  const handleStoryPress = (storyId: string) => {
    router.push(`/story/${storyId}`);
  };

  const getProgressPercentage = (storyId: string) => {
    const storyProgress = getStoryProgress(storyId);
    if (!storyProgress) return 0;
    
    const story = stories.find(s => s.id === storyId);
    if (!story) return 0;
    
    if (storyProgress.isCompleted) return 100;
    
    const chaptersRead = storyProgress.choiceHistory.length + 1;
    return Math.min((chaptersRead / story.chapters.length) * 100, 100);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: currentTheme.background }}>
      <View className="px-6 pt-4 pb-2">
        <Text className="text-3xl font-bold mb-2" style={{ color: currentTheme.titleText }}>Karar Kutusu</Text>
        <Text className="text-base" style={{ color: currentTheme.tertiaryText }}>Yolunu seç, hikayeni şekillendir</Text>
      </View>
      
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {stories.map((story) => {
          const progressPercentage = getProgressPercentage(story.id);
          const storyProgress = getStoryProgress(story.id);
          
          return (
            <TouchableOpacity
              key={story.id}
              className="rounded-2xl mb-4 overflow-hidden border"
              style={{ 
                backgroundColor: currentTheme.cardBackground,
                borderColor: currentTheme.cardBorder 
              }}
              onPress={() => handleStoryPress(story.id)}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: story.coverImage }}
                className="w-full h-48"
                resizeMode="cover"
              />
              
              <View className="p-4">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1 mr-4">
                    <Text className="text-xl font-bold mb-1" style={{ color: currentTheme.primaryText }}>{story.title}</Text>
                    <Text className="text-sm mb-2" style={{ color: currentTheme.secondaryText }}>{story.description}</Text>
                  </View>
                </View>
                
                <View className="flex-row justify-between mb-3">
                  <View className="flex-row items-center">
                    <User size={14} color={currentTheme.tertiaryText} />
                    <Text className="text-xs ml-1" style={{ color: currentTheme.tertiaryText }}>{story.author}</Text>
                  </View>
                  
                  <View className="flex-row items-center">
                    <Clock size={14} color={currentTheme.tertiaryText} />
                    <Text className="text-xs ml-1" style={{ color: currentTheme.tertiaryText }}>{story.estimatedReadTime} min</Text>
                  </View>
                </View>
                
                {progressPercentage > 0 && (
                  <View className="mb-3">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-xs" style={{ color: currentTheme.tertiaryText }}>İlerleme</Text>
                      <Text className="text-xs font-semibold" style={{ color: currentTheme.accentColor }}>
                        {progressPercentage.toFixed(0)}%
                      </Text>
                    </View>
                    <View className="h-2 rounded-sm" style={{ backgroundColor: currentTheme.cardBorder }}>
                      <View 
                        className="h-2 rounded-sm"
                        style={{ 
                          backgroundColor: currentTheme.accentColor,
                          width: `${progressPercentage}%` 
                        }}
                      />
                    </View>
                  </View>
                )}
                
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <BookOpen size={16} color={currentTheme.accentColor} />
                    <Text className="font-semibold ml-2" style={{ color: currentTheme.accentColor }}>
                      {storyProgress?.isCompleted ? 'Tamamlandı' : 
                       storyProgress ? 'Okumaya Devam Et' : 'Okumaya Başla'}
                    </Text>
                  </View>
                  
                  {storyProgress?.isCompleted && (
                    <View 
                      className="px-3 py-1 rounded-xl"
                      style={{ backgroundColor: currentTheme.accentColor }}
                    >
                      <Text 
                        className="text-xs font-bold"
                        style={{ color: settings.theme === 'light' ? '#ffffff' : '#0f172a' }}
                      >
                        {storyProgress.endingType === 'good' ? 'İYİ' : 
                         storyProgress.endingType === 'bad' ? 'KÖTÜ' : 'NÖTR'}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}

export default function StoriesTab() {
  return (
    <Provider store={store}>
      <StoryListScreen />
    </Provider>
  );
}