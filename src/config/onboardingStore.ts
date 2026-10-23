import AsyncStorage from '@react-native-async-storage/async-storage';
import { userPool } from './cognito';
import { CONSENT_VERSION } from './legal';

export type ConsentRecord = {
  privacyNoticeAck: boolean;
  healthDataSharing: boolean;
  version: string;
  acceptedAt: string; // ISO 8601
};

export type OnboardingState = {
  consent?: ConsentRecord;
};

// Un registro por usuario (varias cuentas pueden usar el mismo celular).
function storageKey(): string {
  const username = userPool.getCurrentUser()?.getUsername() ?? 'anon';
  return `@ytc/onboarding/${username}`;
}

export async function getOnboarding(): Promise<OnboardingState> {
  try {
    const raw = await AsyncStorage.getItem(storageKey());
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function saveOnboarding(patch: Partial<OnboardingState>): Promise<void> {
  const current = await getOnboarding();
  await AsyncStorage.setItem(storageKey(), JSON.stringify({ ...current, ...patch }));
}

export async function saveConsent(healthDataSharing: boolean): Promise<void> {
  await saveOnboarding({
    consent: {
      privacyNoticeAck: true,
      healthDataSharing,
      version: CONSENT_VERSION,
      acceptedAt: new Date().toISOString(),
    },
  });
}

export function hasCurrentConsent(state: OnboardingState): boolean {
  return state.consent?.privacyNoticeAck === true && state.consent.version === CONSENT_VERSION;
}