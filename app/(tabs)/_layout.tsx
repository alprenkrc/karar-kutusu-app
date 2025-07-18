import { Tabs } from 'expo-router';
import { Book, Settings, User } from 'lucide-react-native';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useAppSelector } from '@/hooks/useAppSelector';

// Theme definitions for tab bar (consistent with settings.tsx)
const tabThemes = {
  light: {
    backgroundColor: '#ffffff',
    borderTopColor: '#e2e8f0',
    activeTintColor: '#f59e0b',
    inactiveTintColor: '#64748b',
  },
  dark: {
    backgroundColor: '#0f172a',
    borderTopColor: '#1e293b',
    activeTintColor: '#f59e0b',
    inactiveTintColor: '#64748b',
  },
};

function ThemedTabLayout() {
  const { settings } = useAppSelector(state => state.user);
  const currentTabTheme = tabThemes[settings.theme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: currentTabTheme.backgroundColor,
          borderTopColor: currentTabTheme.borderTopColor,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: currentTabTheme.activeTintColor,
        tabBarInactiveTintColor: currentTabTheme.inactiveTintColor,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hikayeler',
          tabBarIcon: ({ size, color }) => (
            <Book size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'İlerleme',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ayarlar',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <Provider store={store}>
      <ThemedTabLayout />
    </Provider>
  );
}