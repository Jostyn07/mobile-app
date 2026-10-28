import { useEffect, useState, type ComponentType } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Droplet, Activity, Plus, ClipboardList, BellRing } from 'lucide-react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { BorderRadius, FontSize, Spacing, Layout, Shadow } from '../../constants/theme';
import {
  getOnboarding,
  saveGlucoseSetup,
  type GlucoseMethod,
  type GlucoseSetup,
} from '../../config/onboardingStore';
import OnboardingHeader from '../../components/onboarding/OnboardingHeader';
import GradientButton from '../../components/auth/GradientButton';
import FormBanner from '../../components/auth/FormBanner';

type Icon = ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

const METHODS: { value: GlucoseMethod; label: string; detail: string; icon: Icon }[] = [
  { value: 'glucometer', label: 'Glucómetro', detail: 'Con una gota de sangre', icon: Droplet },
  { value: 'cgm', label: 'Sensor continuo (CGM)', detail: 'Mide durante todo el día', icon: Activity },
  { value: 'other', label: 'Otro método', detail: 'Otro dispositivo o método', icon: Plus },
];

const METHOD_STATUS = [
  { value: 'not_measuring' as const, label: 'No mido actualmente' },
  { value: 'unsure' as const, label: 'No estoy seguro/a' },
];

const PLAN = [
  { value: 'yes' as const, label: 'Sí', detail: 'Tengo indicaciones de mi equipo de salud' },
  { value: 'no' as const, label: 'No', detail: 'No me han indicado cuándo medir' },
  { value: 'unsure' as const, label: 'No estoy seguro/a' },
];

const REMINDERS = [
  { value: 'yes' as const, label: 'Sí, quiero recordatorios' },
  { value: 'no' as const, label: 'No por ahora' },
  { value: 'undecided' as const, label: 'Todavía no lo sé' },
];

export default function GlucoseScreen() {
  const { theme } = useAppTheme();

  const [methods, setMethods] = useState<GlucoseMethod[]>([]);
  const [methodStatus, setMethodStatus] = useState<GlucoseSetup['methodStatus']>(null);
  const [plan, setPlan] = useState<GlucoseSetup['monitoringPlan'] | null>(null);
  const [reminders, setReminders] = useState<GlucoseSetup['reminders'] | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOnboarding().then(({ glucose }) => {
      if (!glucose) return;
      setMethods(glucose.methods);
      setMethodStatus(glucose.methodStatus);
      setPlan(glucose.monitoringPlan);
      setReminders(glucose.reminders);
    });
  }, []);

  // Marcar un método quita "No mido / No estoy seguro" y viceversa.
  function toggleMethod(m: GlucoseMethod) {
    setMethodStatus(null);
    setMethods((list) => (list.includes(m) ? list.filter((x) => x !== m) : [...list, m]));
  }

  function chooseStatus(v: NonNullable<GlucoseSetup['methodStatus']>) {
    setMethods([]);
    setMethodStatus(v);
  }

  const methodsAnswered = methods.length > 0 || methodStatus !== null;
  const canContinue = methodsAnswered && plan !== null && reminders !== null;

  async function handleContinue() {
    if (!canContinue) return;
    setError(null);
    setSaving(true);
    try {
      await saveGlucoseSetup({ methods, methodStatus, monitoringPlan: plan!, reminders: reminders! });
      router.push('/labs');
    } catch {
      setError('No se pudo guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  function Radio({ selected }: { selected: boolean }) {
    return (
      <View style={[styles.radio, { borderColor: selected ? theme.accent : '#CBD5E1' }]}>
        {selected && <View style={[styles.radioDot, { backgroundColor: theme.accent }]} />}
      </View>
    );
  }

  function SectionHeader({ icon: I, title, subtitle }: { icon: Icon; title: string; subtitle: string }) {
    return (
      <View style={styles.sectionHeader}>
        <View style={[styles.bubble, { backgroundColor: theme.accentLight }]}>
          <I size={16} color={theme.accent} strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        </View>
      </View>
    );
  }

  function RadioOption<T extends string>({
    value,
    label,
    detail,
    current,
    onPress,
  }: {
    value: T;
    label: string;
    detail?: string;
    current: T | null;
    onPress: (v: T) => void;
  }) {
    const selected = current === value;
    return (
      <TouchableOpacity
        onPress={() => onPress(value)}
        activeOpacity={0.8}
        accessibilityRole="radio"
        accessibilityState={{ selected }}
        style={[styles.row, selected ? { borderColor: theme.accent, backgroundColor: theme.accentLight } : null]}
      >
        <Radio selected={selected} />
        <View style={styles.rowText}>
          <Text style={styles.rowLabel}>{label}</Text>
          {detail ? <Text style={styles.rowDetail}>{detail}</Text> : null}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <OnboardingHeader step={5} />

          <Text style={styles.title}>Cómo revisas tu glucosa</Text>
          <Text style={styles.subtitle}>
            Cuéntanos qué métodos usas, si tienes un plan y qué recordatorios prefieres.
          </Text>

          {error && <FormBanner type="error" message={error} />}

          <View style={[styles.card, Shadow.sm]}>
            <SectionHeader icon={Droplet} title="¿Cómo revisas tu glucosa?" subtitle="Puedes elegir más de uno." />

            {METHODS.map((m) => {
              const checked = methods.includes(m.value);
              const I = m.icon;
              return (
                <TouchableOpacity
                  key={m.value}
                  onPress={() => toggleMethod(m.value)}
                  activeOpacity={0.8}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked }}
                  style={[styles.row, checked ? { borderColor: theme.accent, backgroundColor: theme.accentLight } : null]}
                >
                  <View style={[styles.optionIcon, { backgroundColor: checked ? '#fff' : theme.accentLight }]}>
                    <I size={16} color={theme.accent} strokeWidth={2} />
                  </View>
                  <View style={styles.rowText}>
                    <Text style={styles.rowLabel}>{m.label}</Text>
                    <Text style={styles.rowDetail}>{m.detail}</Text>
                  </View>
                  <View
                    style={[
                      styles.checkbox,
                      { borderColor: checked ? theme.accent : '#CBD5E1' },
                      checked && { backgroundColor: theme.accent },
                    ]}
                  >
                    {checked && <Check size={13} color="#fff" strokeWidth={3} />}
                  </View>
                </TouchableOpacity>
              );
            })}

            <Text style={styles.divider}>Si no usas ninguno:</Text>
            {METHOD_STATUS.map((o) => (
              <RadioOption key={o.value} {...o} current={methodStatus} onPress={chooseStatus} />
            ))}
          </View>

          <View style={[styles.card, Shadow.sm]}>
            <SectionHeader
              icon={ClipboardList}
              title="¿Tienes un plan de medición?"
              subtitle="¿Tu equipo de salud te indicó cuándo revisar?"
            />
            {PLAN.map((o) => (
              <RadioOption key={o.value} {...o} current={plan} onPress={setPlan} />
            ))}
          </View>

          <View style={[styles.card, Shadow.sm]}>
            <SectionHeader icon={BellRing} title="¿Quieres recordatorios?" subtitle="Puedes cambiarlo después." />
            {REMINDERS.map((o) => (
              <RadioOption key={o.value} {...o} current={reminders} onPress={setReminders} />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          <GradientButton title="Continuar" onPress={handleContinue} loading={saving} disabled={!canContinue} />
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
  title: { fontSize: FontSize['2xl'], fontWeight: '800', color: '#0F172A', marginBottom: Spacing[2] },
  subtitle: { fontSize: FontSize.sm, color: '#64748B', lineHeight: FontSize.sm * 1.5, marginBottom: Spacing[5] },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.lg,
    padding: Spacing[3],
    marginBottom: Spacing[3],
    gap: Spacing[2],
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], marginBottom: Spacing[1] },
  bubble: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: '#0F172A' },
  sectionSubtitle: { fontSize: FontSize.sm, color: '#64748B', marginTop: 2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    minHeight: 48,
    backgroundColor: '#fff',
  },
  rowText: { flex: 1 },
  rowLabel: { fontSize: FontSize.md, fontWeight: '600', color: '#0F172A' },
  rowDetail: { fontSize: FontSize.sm, color: '#64748B', marginTop: 2 },
  optionIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  divider: { fontSize: FontSize.sm, color: '#64748B', marginTop: Spacing[1] },
  footer: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});