import '@/global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAppSelector } from '@/hooks/useAppSelector';

function ThemedRootLayout() {
  useFrameworkReady();
  const { settings } = useAppSelector(state => state.user);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="story/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={settings.theme === 'light' ? 'dark' : 'light'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemedRootLayout />
    </Provider>
  );
}