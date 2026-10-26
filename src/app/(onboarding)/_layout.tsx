import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="consent" />
      <Stack.Screen name="diagnosis" />
      <Stack.Screen name="diabetes" />
      <Stack.Screen name="history" />
      <Stack.Screen name="glucose" />
      <Stack.Screen name="labs" />
      <Stack.Screen name="safety" />
      <Stack.Screen name="plan" />
      <Stack.Screen name="review" />
    </Stack>
  );
}