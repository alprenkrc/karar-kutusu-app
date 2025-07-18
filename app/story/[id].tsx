import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, Alert } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { store } from '@/store';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { updateStoryProgress } from '@/store/slices/userSlice';
import { StorageService } from '@/utils/storage';
import { ArrowLeft, RotateCcw, Users } from 'lucide-react-native';
import { Chapter, Choice, UserProgress } from '@/types/Story';

// Theme definitions (consistent with settings.tsx)
const themes = {
  light: {
    background: '#ffffff',
    cardBackground: '#f8fafc',
    cardBorder: '#e2e8f0',
    headerBorder: '#e2e8f0',
    titleText: '#1e293b',
    primaryText: '#334155',
    secondaryText: '#64748b',
    tertiaryText: '#94a3b8',
    contentText: '#475569',
    choiceBackground: '#f8fafc',
    choiceBorder: '#cbd5e1',
    accentColor: '#f59e0b',
  },
  dark: {
    background: '#0f172a',
    cardBackground: '#1e293b',
    cardBorder: '#334155',
    headerBorder: '#334155',
    titleText: '#ffffff',
    primaryText: '#ffffff',
    secondaryText: '#e2e8f0',
    tertiaryText: '#94a3b8',
    contentText: '#e2e8f0',
    choiceBackground: '#1e293b',
    choiceBorder: '#475569',
    accentColor: '#f59e0b',
  },
};

function StoryReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { stories } = useAppSelector(state => state.story);
  const { progress, settings } = useAppSelector(state => state.user);
  
  // Get current theme colors
  const currentTheme = themes[settings.theme];

  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const currentStory = stories.find(story => story.id === id);
  const storyProgress = progress.find(p => p.storyId === id);

  useEffect(() => {
    if (!currentStory) return;



    if (storyProgress) {
      // Hikaye progress'i varsa, tamamlanmış olsa bile o chapter'ı göster
      const chapter = currentStory.chapters.find(c => c.id === storyProgress.currentChapterId);
      setCurrentChapter(chapter || currentStory.chapters[0]);
    } else {
      // Hiç progress yoksa ilk chapter'dan başla
      setCurrentChapter(currentStory.chapters[0]);
    }
  }, [currentStory, storyProgress]);

  const getFontSize = () => {
    switch (settings.fontSize) {
      case 'small': return 16;
      case 'large': return 20;
      default: return 18;
    }
  };

  const handleChoiceSelect = async (choice: Choice) => {
    if (!currentStory || !currentChapter || isTransitioning) return;

    setIsTransitioning(true);

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      const nextChapter = currentStory.chapters.find(c => c.id === choice.nextChapterId);
      if (!nextChapter) {
        setIsTransitioning(false);
        return;
      }

      const isEndingChapter = nextChapter.isEnding === true || nextChapter.choices.length === 0;


      const newProgress: UserProgress = {
        storyId: id!,
        currentChapterId: nextChapter.id,
        choiceHistory: [
          ...(storyProgress?.choiceHistory || []),
          {
            chapterId: currentChapter.id,
            choiceId: choice.id,
            timestamp: Date.now(),
          }
        ],
        isCompleted: isEndingChapter,
        completedAt: isEndingChapter ? Date.now() : undefined,
        endingType: nextChapter.endingType,
      };


      dispatch(updateStoryProgress(newProgress));
      StorageService.saveUserProgress([
        ...progress.filter(p => p.storyId !== id),
        newProgress
      ]);

      setCurrentChapter(nextChapter);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsTransitioning(false);
      });
    });
  };

  const handleRestart = () => {
    Alert.alert(
      'Hikayeyi Yeniden Başlat',
      'Bu hikayeyi baştan başlatmak istediğinizden emin misiniz? Mevcut ilerlemeniz silinecek.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Yeniden Başlat',
          style: 'destructive',
          onPress: () => {
            if (!currentStory) return;
            
            const newProgress = progress.filter(p => p.storyId !== id);
            dispatch(updateStoryProgress({
              storyId: id!,
              currentChapterId: currentStory.chapters[0].id,
              choiceHistory: [],
              isCompleted: false,
            }));
            
            StorageService.saveUserProgress(newProgress);
            setCurrentChapter(currentStory.chapters[0]);
          },
        },
      ]
    );
  };

  if (!currentStory) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center" style={{ backgroundColor: currentTheme.background }}>
        <Text className="text-lg" style={{ color: currentTheme.primaryText }}>Hikaye bulunamadı</Text>
      </SafeAreaView>
    );
  }

  if (!currentChapter) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center" style={{ backgroundColor: currentTheme.background }}>
        <Text className="text-lg" style={{ color: currentTheme.primaryText }}>Yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: currentTheme.background }}>
      {/* Header */}
      <View 
        className="flex-row items-center justify-between px-6 py-4 border-b"
        style={{ borderBottomColor: currentTheme.headerBorder }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center"
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={currentTheme.primaryText} />
          <Text className="font-semibold ml-2" style={{ color: currentTheme.primaryText }}>Geri</Text>
        </TouchableOpacity>
        
        <View className="flex-1 items-center">
          <Text className="font-bold text-lg" numberOfLines={1} style={{ color: currentTheme.primaryText }}>
            {currentStory.title}
          </Text>
        </View>
        
        <View className="w-16" />
      </View>

      <Animated.View className="flex-1" style={{ opacity: fadeAnim }}>
        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
          {/* Chapter Title */}
          <View className="mb-6">
            <Text className="text-2xl font-bold mb-2" style={{ color: currentTheme.primaryText }}>{currentChapter.title}</Text>
            <View className="w-12 h-1 rounded-sm" style={{ backgroundColor: currentTheme.accentColor }} />
          </View>

          {/* Chapter Content */}
          <View 
            className="rounded-2xl p-6 mb-6 border"
            style={{ 
              backgroundColor: currentTheme.cardBackground,
              borderColor: currentTheme.cardBorder 
            }}
          >
            <Text style={{ color: currentTheme.contentText, fontSize: getFontSize(), lineHeight: 28 }}>
              {currentChapter.content}
            </Text>
          </View>

          {/* Choices or Ending */}
          {(() => {
            const isEndingChapter = currentChapter.isEnding === true || currentChapter.choices.length === 0;

            
            if (isEndingChapter) {
              return (
                <View className="items-center mb-8">
                  <View className="p-4 rounded-3xl mb-4" style={{ backgroundColor: currentTheme.accentColor }}>
                    <RotateCcw size={24} color={settings.theme === 'light' ? '#ffffff' : '#0f172a'} />
                  </View>
                  
                  <Text className="text-2xl font-bold mb-2" style={{ color: currentTheme.primaryText }}>Hikaye Tamamlandı!</Text>
                  <Text className="text-center mb-6" style={{ color: currentTheme.secondaryText }}>
                    Bu maceranın sonuna ulaştınız. Farklı seçimler yaparak alternatif sonları keşfedebilirsiniz.
                  </Text>
                  
                  <TouchableOpacity
                    className="px-8 py-4 rounded-xl"
                    style={{ backgroundColor: currentTheme.accentColor }}
                    onPress={handleRestart}
                    activeOpacity={0.7}
                  >
                    <Text className="font-bold text-center" style={{ color: settings.theme === 'light' ? '#ffffff' : '#0f172a' }}>Yeniden Başlat</Text>
                  </TouchableOpacity>
                </View>
              );
            } else {
              return (
                <View className="mb-8">
                  <Text className="font-bold text-lg mb-4" style={{ color: currentTheme.primaryText }}>Ne seçiyorsun?</Text>
                  
                  {currentChapter.choices.map((choice, index) => (
                    <TouchableOpacity
                      key={choice.id}
                      className="p-5 mb-4 border rounded-xl"
                      style={{ 
                        backgroundColor: currentTheme.choiceBackground,
                        borderColor: currentTheme.choiceBorder 
                      }}
                      onPress={() => handleChoiceSelect(choice)}
                      activeOpacity={0.7}
                      disabled={isTransitioning}
                    >
                      <Text className="font-semibold text-base mb-2" style={{ color: currentTheme.primaryText }}>{choice.text}</Text>
                      
                      {choice.popularity && (
                        <View className="flex-row items-center">
                          <Users size={14} color={currentTheme.tertiaryText} />
                          <Text className="text-xs ml-1" style={{ color: currentTheme.tertiaryText }}>
                            Okuyucuların %{choice.popularity}'ı bunu seçti
                          </Text>
                          <View className="ml-2 flex-1 h-1 rounded-sm" style={{ backgroundColor: currentTheme.cardBorder }}>
                            <View 
                              className="h-1 rounded-sm"
                              style={{ 
                                backgroundColor: currentTheme.accentColor,
                                width: `${choice.popularity}%` 
                              }}
                            />
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              );
            }
          })()}

          <View className="h-20" />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

export default function StoryPage() {
  return (
    <Provider store={store}>
      <StoryReaderScreen />
    </Provider>
  );
}