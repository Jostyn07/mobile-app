import { router } from 'expo-router';
import { getOnboarding, hasCurrentConsent, clearOnboarding } from './onboardingStore';
import { RESTART_ONBOARDING_ON_LOGIN } from './devFlags';

// Decide a dónde va el usuario después de iniciar sesión.
export async function routeAfterLogin(): Promise<void> {
  if (RESTART_ONBOARDING_ON_LOGIN) {
    await clearOnboarding().catch(() => {});
    router.replace('/consent');
    return;
  }

  const state = await getOnboarding();
  router.replace(hasCurrentConsent(state) ? '/(tabs)' : '/consent');
}