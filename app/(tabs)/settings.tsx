import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { store } from '@/store';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { updateSettings, setUserProgress } from '@/store/slices/userSlice';
import { StorageService } from '@/utils/storage';
import { Type, Palette, Trash2, Info } from 'lucide-react-native';

// Theme definitions
const themes = {
  light: {
    background: '#ffffff',
    cardBackground: '#f8fafc',
    cardBorder: '#e2e8f0',
    titleText: '#1e293b',
    primaryText: '#334155',
    secondaryText: '#64748b',
    accentColor: '#f59e0b',
    destructiveColor: '#dc2626',
    infoColor: '#3b82f6',
  },
  dark: {
    background: '#0f172a',
    cardBackground: '#1e293b',
    cardBorder: '#334155',
    titleText: '#ffffff',
    primaryText: '#ffffff',
    secondaryText: '#94a3b8',
    accentColor: '#f59e0b',
    destructiveColor: '#dc2626',
    infoColor: '#3b82f6',
  },
};

function SettingsScreen() {
  const dispatch = useAppDispatch();
  const { settings, progress } = useAppSelector(state => state.user);
  
  // Get current theme colors
  const currentTheme = themes[settings.theme];

  const handleFontSizeChange = async (size: 'small' | 'medium' | 'large') => {
    const newSettings = { ...settings, fontSize: size };
    dispatch(updateSettings(newSettings));
    await StorageService.saveUserSettings(newSettings);
  };

  const handleThemeChange = async (theme: 'light' | 'dark') => {
    const newSettings = { ...settings, theme };
    dispatch(updateSettings(newSettings));
    await StorageService.saveUserSettings(newSettings);
  };

  const handleResetProgress = () => {
    Alert.alert(
      'İlerlemeyi Sıfırla',
      'Tüm hikaye ilerlemenizi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sıfırla',
          style: 'destructive',
          onPress: async () => {
            dispatch(setUserProgress([]));
            await StorageService.saveUserProgress([]);
          },
        },
      ]
    );
  };

  const FontSizeOption = ({ size, label }: { size: 'small' | 'medium' | 'large'; label: string }) => (
    <TouchableOpacity
      className="p-3 rounded-lg border"
      style={{
        borderColor: settings.fontSize === size ? currentTheme.accentColor : currentTheme.cardBorder,
        backgroundColor: settings.fontSize === size ? `${currentTheme.accentColor}1A` : 'transparent'
      }}
      onPress={() => handleFontSizeChange(size)}
    >
      <Text 
        className="text-center font-semibold"
        style={{ color: settings.fontSize === size ? currentTheme.accentColor : currentTheme.primaryText }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const ThemeOption = ({ theme, label }: { theme: 'light' | 'dark'; label: string }) => (
    <TouchableOpacity
      className="p-3 rounded-lg border"
      style={{
        borderColor: settings.theme === theme ? currentTheme.accentColor : currentTheme.cardBorder,
        backgroundColor: settings.theme === theme ? `${currentTheme.accentColor}1A` : 'transparent'
      }}
      onPress={() => handleThemeChange(theme)}
    >
      <Text 
        className="text-center font-semibold"
        style={{ color: settings.theme === theme ? currentTheme.accentColor : currentTheme.primaryText }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: currentTheme.background }}>
      <View className="px-6 pt-4 pb-6">
        <Text className="text-3xl font-bold mb-2" style={{ color: currentTheme.titleText }}>Ayarlar</Text>
        <Text className="text-base" style={{ color: currentTheme.secondaryText }}>Okuma deneyimini özelleştir</Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Reading Preferences */}
        <View 
          className="rounded-2xl p-6 mb-6 border"
          style={{ 
            backgroundColor: currentTheme.cardBackground,
            borderColor: currentTheme.cardBorder 
          }}
        >
          <View className="flex-row items-center mb-4">
            <Type size={20} color={currentTheme.accentColor} />
            <Text className="text-xl font-bold ml-3" style={{ color: currentTheme.primaryText }}>Okuma Tercihleri</Text>
          </View>
          
          <Text className="font-semibold mb-3" style={{ color: currentTheme.primaryText }}>Yazı Boyutu</Text>
          <View className="flex-row mb-6">
            <View className="flex-1 mx-1">
              <FontSizeOption size="small" label="Küçük" />
            </View>
            <View className="flex-1 mx-1">
              <FontSizeOption size="medium" label="Orta" />
            </View>
            <View className="flex-1 mx-1">
              <FontSizeOption size="large" label="Büyük" />
            </View>
          </View>
          
          <Text className="font-semibold mb-3" style={{ color: currentTheme.primaryText }}>Tema</Text>
          <View className="flex-row mb-6">
            <View className="flex-1 mx-1">
              <ThemeOption theme="dark" label="Koyu" />
            </View>
            <View className="flex-1 mx-1">
              <ThemeOption theme="light" label="Açık" />
            </View>
          </View>
        </View>

        {/* Progress Management */}
        <View 
          className="rounded-2xl p-6 mb-6 border"
          style={{ 
            backgroundColor: currentTheme.cardBackground,
            borderColor: currentTheme.cardBorder 
          }}
        >
          <View className="flex-row items-center mb-4">
            <Trash2 size={20} color={currentTheme.destructiveColor} />
            <Text className="text-xl font-bold ml-3" style={{ color: currentTheme.primaryText }}>İlerleme Yönetimi</Text>
          </View>
          
          <Text className="text-sm mb-4" style={{ color: currentTheme.secondaryText }}>
            {progress.length} hikaye için kaydedilmiş ilerlemeniz var. Gerekirse tüm ilerlemeyi sıfırlayabilirsiniz.
          </Text>
          
          <TouchableOpacity
            className="p-4 rounded-lg"
            style={{ backgroundColor: currentTheme.destructiveColor }}
            onPress={handleResetProgress}
            activeOpacity={0.7}
          >
            <Text className="text-white font-semibold text-center">Tüm İlerlemeyi Sıfırla</Text>
          </TouchableOpacity>
        </View>

        {/* App Information */}
        <View 
          className="rounded-2xl p-6 mb-6 border"
          style={{ 
            backgroundColor: currentTheme.cardBackground,
            borderColor: currentTheme.cardBorder 
          }}
        >
          <View className="flex-row items-center mb-4">
            <Info size={20} color={currentTheme.infoColor} />
            <Text className="text-xl font-bold ml-3" style={{ color: currentTheme.primaryText }}>Karar Kutusu Hakkında</Text>
          </View>
          
          <Text className="text-sm mb-2" style={{ color: currentTheme.secondaryText }}>
            <Text className="font-semibold" style={{ color: currentTheme.primaryText }}>Sürüm:</Text> 1.0.0
          </Text>
          <Text className="text-sm mb-2" style={{ color: currentTheme.secondaryText }}>
            <Text className="font-semibold" style={{ color: currentTheme.primaryText }}>Açıklama:</Text> Kendi hikaye maceranızı şekillendirmenize 
            olanak tanıyan interaktif seçim tabanlı hikaye uygulaması.
          </Text>
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}

export default function SettingsTab() {
  return (
    <Provider store={store}>
      <SettingsScreen />
    </Provider>
  );
}