import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Hata!' }} />
      <View className="flex-1 items-center justify-center p-5">
        <Text className="text-xl font-semibold">Bu sayfa mevcut değil.</Text>
        <Link href="/" className="mt-4 py-4">
          <Text>Ana sayfaya git!</Text>
        </Link>
      </View>
    </>
  );
}
