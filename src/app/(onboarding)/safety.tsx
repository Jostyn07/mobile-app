import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Phone } from 'lucide-react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { BorderRadius, FontSize, Spacing, Layout, Shadow, BrandColors } from '../../constants/theme';
import { getOnboarding, saveSafety, type SafetyAnswers } from '../../config/onboardingStore';
import OnboardingHeader from '../../components/onboarding/OnboardingHeader';
import GradientButton from '../../components/auth/GradientButton';
import FormBanner from '../../components/auth/FormBanner';

type Option<T> = { value: T; label: string };

const YES_NO_UNSURE: Option<'yes' | 'no' | 'unsure'>[] = [
  { value: 'yes', label: 'Sí' },
  { value: 'no', label: 'No' },
  { value: 'unsure', label: 'No estoy seguro/a' },
];
const HELP: Option<'yes' | 'no' | 'dont_remember'>[] = [
  { value: 'yes', label: 'Sí' },
  { value: 'no', label: 'No' },
  { value: 'dont_remember', label: 'No lo recuerdo' },
];
const CONTACT: Option<boolean>[] = [
  { value: true, label: 'Sí, quiero que me contacten' },
  { value: false, label: 'No por ahora' },
];

type Draft = { [K in keyof SafetyAnswers]: SafetyAnswers[K] | null };
const EMPTY: Draft = {
  hypoglycemia: null,
  hypoNeededHelp: null,
  urgentSymptoms: null,
  urgentContact: null,
  footChanges: null,
  footContact: null,
};

// Cada pregunta principal y, si responde "Sí", su pregunta de seguimiento.
const STEPS = [
  {
    main: 'hypoglycemia',
    mainTitle: '¿Has tenido episodios de glucosa baja?',
    mainHint: 'Desde tu último control.',
    follow: 'hypoNeededHelp',
    followTitle: '¿Necesitaste ayuda de otra persona?',
    followOptions: HELP,
  },
  {
    main: 'urgentSymptoms',
    mainTitle: '¿Has tenido síntomas que te preocuparan o buscado atención urgente por la diabetes?',
    mainHint: 'Desde tu último control.',
    follow: 'urgentContact',
    followTitle: '¿Quieres que el equipo se ponga en contacto contigo?',
    followOptions: CONTACT,
  },
  {
    main: 'footChanges',
    mainTitle: '¿Has notado heridas, enrojecimiento, hinchazón, calor u otros cambios en los pies?',
    mainHint: undefined,
    follow: 'footContact',
    followTitle: '¿Quieres que el equipo se ponga en contacto contigo?',
    followOptions: CONTACT,
  },
] as const;

export default function SafetyScreen() {
  const { theme } = useAppTheme();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Draft>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOnboarding().then(({ safety }) => safety && setAnswers(safety));
  }, []);

  const current = STEPS[step];
  const mainValue = answers[current.main];
  const needsFollow = mainValue === 'yes';
  const followValue = answers[current.follow];
  const stepDone = mainValue !== null && (!needsFollow || followValue !== null);

  function setMain(v: 'yes' | 'no' | 'unsure') {
    // El seguimiento solo aplica si responde "Sí".
    setAnswers((a) => ({ ...a, [current.main]: v, ...(v === 'yes' ? {} : { [current.follow]: null }) }));
  }

  function setFollow(v: unknown) {
    setAnswers((a) => ({ ...a, [current.follow]: v }));
  }

  function back() {
    if (step > 0) setStep(step - 1);
    else router.back();
  }

  async function handleContinue() {
    if (!stepDone) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await saveSafety(answers as SafetyAnswers);
      router.push('/plan');
    } catch {
      setError('No se pudo guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  function OptionRow<T>({ option, selected, onPress }: { option: Option<T>; selected: boolean; onPress: () => void }) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="radio"
        accessibilityState={{ selected }}
        style={[styles.row, selected && { borderColor: theme.accent, backgroundColor: theme.accentLight }]}
      >
        <View style={[styles.radio, { borderColor: selected ? theme.accent : '#CBD5E1' }]}>
          {selected && <View style={[styles.radioDot, { backgroundColor: theme.accent }]} />}
        </View>
        <Text style={styles.rowLabel}>{option.label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <OnboardingHeader step={7} onBack={back} />

          <Text style={styles.title}>Antecedentes de seguridad</Text>
          <Text style={[styles.counter, { color: theme.accent }]}>
            PREGUNTA {step + 1} DE {STEPS.length}
          </Text>

          {error && <FormBanner type="error" message={error} />}

          <View style={[styles.card, Shadow.sm]}>
            <View style={styles.header}>
              <View style={[styles.bubble, { backgroundColor: theme.accentLight }]}>
                <Heart size={16} color={theme.accent} strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.question}>{current.mainTitle}</Text>
                {current.mainHint ? <Text style={styles.hint}>{current.mainHint}</Text> : null}
              </View>
            </View>
            {YES_NO_UNSURE.map((o) => (
              <OptionRow key={o.value} option={o} selected={mainValue === o.value} onPress={() => setMain(o.value)} />
            ))}
          </View>

          {needsFollow && (
            <View style={[styles.card, Shadow.sm]}>
              <Text style={styles.question}>{current.followTitle}</Text>
              {current.followOptions.map((o: Option<unknown>) => (
                <OptionRow
                  key={String(o.value)}
                  option={o}
                  selected={followValue === o.value}
                  onPress={() => setFollow(o.value)}
                />
              ))}
            </View>
          )}

          <TouchableOpacity
            onPress={() => Linking.openURL('tel:911')}
            activeOpacity={0.85}
            style={styles.emergency}
            accessibilityRole="button"
          >
            <View style={styles.emergencyIcon}>
              <Phone size={16} color="#fff" strokeWidth={2.5} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.emergencyTitle}>¿Te ocurre ahora?</Text>
              <Text style={styles.emergencyText}>Si es una emergencia, llama al 911.</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          <GradientButton title="Continuar" onPress={handleContinue} loading={saving} disabled={!stepDone} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[6],
  },
  content: { width: '100%', maxWidth: Layout.maxContentWidth, alignSelf: 'center' },
  title: { fontSize: FontSize['2xl'], fontWeight: '800', color: '#0F172A', marginBottom: Spacing[4] },
  counter: { fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 0.5, marginBottom: Spacing[2] },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.lg,
    padding: Spacing[3],
    marginBottom: Spacing[3],
    gap: Spacing[2],
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing[3], marginBottom: Spacing[1] },
  bubble: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  question: { fontSize: FontSize.md, fontWeight: '700', color: '#0F172A', lineHeight: FontSize.md * 1.35 },
  hint: { fontSize: FontSize.sm, color: '#64748B', marginTop: 2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing[3],
    minHeight: 46,
    backgroundColor: '#fff',
  },
  rowLabel: { flex: 1, fontSize: FontSize.md, color: '#0F172A' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  emergency: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: BorderRadius.lg,
    padding: Spacing[3],
    marginTop: Spacing[2],
  },
  emergencyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BrandColors.emergencia,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyTitle: { fontSize: FontSize.md, fontWeight: '700', color: '#9A3412' },
  emergencyText: { fontSize: FontSize.sm, color: '#9A3412', marginTop: 2 },
  footer: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});