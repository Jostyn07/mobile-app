import { router } from 'expo-router';
import { getOnboarding, hasCurrentConsent } from './onboardingStore';

// Decide a dónde va el usuario después de iniciar sesión.
export async function routeAfterLogin(): Promise<void> {
  const state = await getOnboarding();
  router.replace(hasCurrentConsent(state) ? '/(tabs)' : '/consent');
}