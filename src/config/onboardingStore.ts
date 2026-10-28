import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { userPool } from './cognito';
import { apiPost, apiPut, API_URL } from './api';
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

export type CodeSource = 'rxnorm' | 'unii' | 'manual'; // manual = escrito libre, no normalizado

export type Medication = {
  id: string;
  name: string;
  rxcui: string | null; // código RxNorm del medicamento o de la concentración elegida
  strength: string; // concentración y presentación, ej. "500 mg Tab"
  source: CodeSource;
  dose: string; // lo que declara la persona; nunca lo completa el catálogo
  frequency: string;
  reason: string;
  status: 'current' | 'past';
};

export type AllergyCategory = 'medication' | 'food' | 'environment';

export type AllergyReaction = 'skin' | 'swelling' | 'breathing' | 'digestive' | 'other';

export type Allergy = {
  id: string;
  substance: string;
  code: string | null;
  source: CodeSource;
  category: AllergyCategory;
  reactions: AllergyReaction[];
  verification: 'confirmed' | 'self_reported';
};

// null = todavía no respondió. No es lo mismo que "ninguna" ni que "no sé".
export type AllergyStatus = 'has_allergies' | 'none_known' | 'unsure' | null;

export type MedicalHistory = {
  otherConditions: ConditionId[];
  familyHistory: string[];
  noFamilyHistory: boolean;
  medications: Medication[];
  noMedications: boolean;
  allergies: Allergy[];
  allergyStatus: AllergyStatus;
};

export const EMPTY_HISTORY: MedicalHistory = {
  otherConditions: [],
  familyHistory: [],
  noFamilyHistory: false,
  medications: [],
  noMedications: false,
  allergies: [],
  allergyStatus: null,
};

export type GlucoseMethod = 'glucometer' | 'cgm' | 'other';
export type GlucoseSetup = {
  methods: GlucoseMethod[];
  methodStatus: 'not_measuring' | 'unsure' | null; // solo si no marcó ningún método
  monitoringPlan: 'yes' | 'no' | 'unsure';
  reminders: 'yes' | 'no' | 'undecided';
};

export type LabKind = 'hba1c' | 'eye' | 'kidney' | 'feet';
export type LabStatus = 'has_data' | 'done_no_data' | 'not_done' | 'unsure';
export type LabRecord = {
  status: LabStatus;
  date: MonthYear | null; // solo si status = has_data
  value: string; // HbA1c en % o resultado renal; vacío si no lo sabe
};
export type LabRecords = Record<LabKind, LabRecord>;

export type OnboardingState = {
  consent?: ConsentRecord;
  conditions?: ConditionId[];
  diabetes?: DiabetesDetails;
  history?: MedicalHistory;
  glucose?: GlucoseSetup;
  labs?: LabRecords;
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

// Registra el consentimiento en el servidor (constancia legal) y luego en el celular.
// Si el servidor no responde, lanza error y el usuario debe reintentar.
export async function saveConsent(healthDataSharing: boolean): Promise<void> {
  if (API_URL) {
    await apiPost('/me/consents', {
      version: CONSENT_VERSION,
      privacyNoticeAck: true,
      termsAccepted: true,
      healthDataSharing,
      platform: Platform.OS === 'ios' || Platform.OS === 'android' ? Platform.OS : 'web',
    });
  }
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

// Pasos 2, 3 y 5: primero el servidor; si falla, lanza error y el usuario reintenta.
export async function saveConditions(conditions: ConditionId[]): Promise<void> {
  if (API_URL) await apiPut('/me/conditions', { conditions });
  await saveOnboarding({ conditions });
}

export async function saveDiabetesDetails(details: DiabetesDetails): Promise<void> {
  if (API_URL) await apiPut('/me/diabetes', details);
  await saveOnboarding({ diabetes: details });
}

export async function saveHistory(history: MedicalHistory): Promise<void> {
  await saveOnboarding({ history });
}

export async function clearOnboarding(): Promise<void> {
  await AsyncStorage.removeItem(storageKey());
}

export async function saveGlucoseSetup(glucose: GlucoseSetup): Promise<void> {
  if (API_URL) await apiPut('/me/glucose', glucose);
  await saveOnboarding({ glucose });
}

export async function saveLabs(labs: LabRecords): Promise<void> {
  if (API_URL) await apiPut('/me/labs', labs);
  await saveOnboarding({ labs });
}