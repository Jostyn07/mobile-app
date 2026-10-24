import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../theme/ThemeContext';
import { loadAuthStorage } from '../config/cognito';

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadAuthStorage().finally(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="legal/privacy" />
        <Stack.Screen name="legal/terms" />
      </Stack>
    </ThemeProvider>
  );
}