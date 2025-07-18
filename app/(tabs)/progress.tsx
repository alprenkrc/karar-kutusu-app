import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { store } from '@/store';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Trophy, Clock, BookOpen, Target } from 'lucide-react-native';

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
  },
  dark: {
    background: '#0f172a',
    cardBackground: '#1e293b',
    cardBorder: '#334155',
    titleText: '#ffffff',
    primaryText: '#ffffff',
    secondaryText: '#94a3b8',
    tertiaryText: '#64748b',
  },
};

function ProgressScreen() {
  const { progress, settings } = useAppSelector(state => state.user);
  const { stories } = useAppSelector(state => state.story);

  // Get current theme colors
  const currentTheme = themes[settings.theme];

  const completedStories = progress.filter(p => p.isCompleted);
  const inProgressStories = progress.filter(p => !p.isCompleted);
  const totalChoices = progress.reduce((sum, p) => sum + p.choiceHistory.length, 0);

  const getStoryTitle = (storyId: string) => {
    return stories.find(s => s.id === storyId)?.title || 'Unknown Story';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getEndingColor = (endingType?: string) => {
    switch (endingType) {
      case 'good': return '#10b981';
      case 'bad': return '#ef4444';
      case 'neutral': return '#eab308';
      default: return currentTheme.secondaryText;
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: currentTheme.background }}>
      <View className="px-6 pt-4 pb-6">
        <Text className="text-3xl font-bold mb-2" style={{ color: currentTheme.titleText }}>Yolculuğun</Text>
        <Text className="text-base" style={{ color: currentTheme.secondaryText }}>Hikaye ilerlemeni ve başarılarını takip et</Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        <View 
          className="rounded-2xl p-6 mb-6 border"
          style={{ 
            backgroundColor: currentTheme.cardBackground,
            borderColor: currentTheme.cardBorder 
          }}
        >
          <Text className="text-xl font-bold mb-4" style={{ color: currentTheme.primaryText }}>İstatistiklerin</Text>
          
          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <View className="p-3 rounded-3xl mb-2" style={{ backgroundColor: '#f59e0b' }}>
                <Trophy size={20} color="#0f172a" />
              </View>
              <Text className="text-2xl font-bold" style={{ color: currentTheme.primaryText }}>{completedStories.length}</Text>
              <Text className="text-xs text-center" style={{ color: currentTheme.secondaryText }}>Tamamlanan{'\n'}Hikayeler</Text>
            </View>
            
            <View className="items-center flex-1">
              <View className="p-3 rounded-3xl mb-2" style={{ backgroundColor: '#0ea5e9' }}>
                <BookOpen size={20} color="#ffffff" />
              </View>
              <Text className="text-2xl font-bold" style={{ color: currentTheme.primaryText }}>{inProgressStories.length}</Text>
              <Text className="text-xs text-center" style={{ color: currentTheme.secondaryText }}>Devam{'\n'}Eden</Text>
            </View>
            
            <View className="items-center flex-1">
              <View className="p-3 rounded-3xl mb-2" style={{ backgroundColor: '#8b5cf6' }}>
                <Target size={20} color="#ffffff" />
              </View>
              <Text className="text-2xl font-bold" style={{ color: currentTheme.primaryText }}>{totalChoices}</Text>
              <Text className="text-xs text-center" style={{ color: currentTheme.secondaryText }}>Yapılan{'\n'}Seçimler</Text>
            </View>
          </View>
        </View>

        {/* Completed Stories */}
        {completedStories.length > 0 && (
          <View className="mb-6">
            <Text className="text-xl font-bold mb-4" style={{ color: currentTheme.primaryText }}>Tamamlanan Hikayeler</Text>
            {completedStories.map((storyProgress) => (
              <TouchableOpacity 
                key={storyProgress.storyId} 
                className="rounded-xl p-4 mb-3 border"
                style={{ 
                  backgroundColor: currentTheme.cardBackground,
                  borderColor: currentTheme.cardBorder 
                }}
                activeOpacity={0.7}
              >
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="font-semibold flex-1" style={{ color: currentTheme.primaryText }}>{getStoryTitle(storyProgress.storyId)}</Text>
                  <View className="px-3 py-1 rounded-xl" style={{ backgroundColor: '#f59e0b' }}>
                    <Text className="text-xs font-bold" style={{ color: '#0f172a' }}>Tamamlandı</Text>
                  </View>
                </View>
                
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-semibold" style={{ color: getEndingColor(storyProgress.endingType) }}>
                    {storyProgress.endingType === 'good' ? 'İyi Son' : 
                     storyProgress.endingType === 'bad' ? 'Kötü Son' : 'Nötr Son'}
                  </Text>
                  <Text className="text-xs" style={{ color: currentTheme.secondaryText }}>
                    {storyProgress.completedAt ? formatDate(storyProgress.completedAt) : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* In Progress Stories */}
        {inProgressStories.length > 0 && (
          <View className="mb-6">
            <Text className="text-xl font-bold mb-4" style={{ color: currentTheme.primaryText }}>Okumaya Devam Et</Text>
            {inProgressStories.map((storyProgress) => {
              const story = stories.find(s => s.id === storyProgress.storyId);
              const progressPercentage = story ? 
                Math.min(((storyProgress.choiceHistory.length + 1) / story.chapters.length) * 100, 100) : 0;
              
              return (
                <TouchableOpacity 
                  key={storyProgress.storyId} 
                  className="rounded-xl p-4 mb-3 border"
                  style={{ 
                    backgroundColor: currentTheme.cardBackground,
                    borderColor: currentTheme.cardBorder 
                  }}
                  activeOpacity={0.7}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="font-semibold flex-1" style={{ color: currentTheme.primaryText }}>{getStoryTitle(storyProgress.storyId)}</Text>
                    <Text className="text-xs font-semibold" style={{ color: '#0ea5e9' }}>
                      {progressPercentage.toFixed(0)}%
                    </Text>
                  </View>
                  
                  <View className="h-2 rounded-sm mb-2" style={{ backgroundColor: currentTheme.cardBorder }}>
                    <View 
                      className="h-2 rounded-sm"
                      style={{ 
                        backgroundColor: '#0ea5e9',
                        width: `${progressPercentage}%` 
                      }}
                    />
                  </View>
                  
                  <Text className="text-xs" style={{ color: currentTheme.secondaryText }}>
                    {storyProgress.choiceHistory.length} seçim yapıldı
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {progress.length === 0 && (
          <View className="items-center justify-center py-12">
            <BookOpen size={48} color={currentTheme.tertiaryText} />
            <Text className="text-lg mt-4 text-center" style={{ color: currentTheme.secondaryText }}>
              Henüz hiç hikaye başlatılmadı
            </Text>
            <Text className="text-sm text-center mt-1" style={{ color: currentTheme.tertiaryText }}>
              İlk maceranı Hikayeler sekmesinde başlat
            </Text>
          </View>
        )}

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}

export default function ProgressTab() {
  return (
    <Provider store={store}>
      <ProgressScreen />
    </Provider>
  );
}