import AsyncStorage from '@react-native-async-storage/async-storage';
import { userPool } from './cognito';
import { CONSENT_VERSION } from './legal';
import type { ConditionId } from '../content/conditions';

export type ConsentRecord = {
  privacyNoticeAck: boolean;
  termsAccepted: boolean;
  healthDataSharing: boolean;
  version: string;
  acceptedAt: string; // ISO 8601
};

export type DiabetesType = 'type1' | 'type2' | 'unsure';

export type MonthYear = { year: number; month: number }; // month 1–12

export type DiabetesDetails = {
  type: DiabetesType;
  diagnosedAt: MonthYear | null; // null = no la eligió o no la recuerda
  dateUnknown: boolean;
};

export type OnboardingState = {
  consent?: ConsentRecord;
  conditions?: ConditionId[];
  diabetes?: DiabetesDetails;
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
      termsAccepted: true,
      healthDataSharing,
      version: CONSENT_VERSION,
      acceptedAt: new Date().toISOString(),
    },
  });
}

export function hasCurrentConsent(state: OnboardingState): boolean {
  const c = state.consent;
  return c?.privacyNoticeAck === true && c.termsAccepted === true && c.version === CONSENT_VERSION;
}

export async function saveConditions(conditions: ConditionId[]): Promise<void> {
  await saveOnboarding({ conditions });
}

export async function saveDiabetesDetails(details: DiabetesDetails): Promise<void> {
  await saveOnboarding({ diabetes: details });
}