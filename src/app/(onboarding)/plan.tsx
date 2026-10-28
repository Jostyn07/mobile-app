import { useEffect, useState, type ComponentType } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, AlarmClock, BellRing, HeartHandshake } from 'lucide-react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { BorderRadius, FontSize, Spacing, Layout, Shadow } from '../../constants/theme';
import {
  getOnboarding,
  savePlan,
  type NotifyChannel,
  type ReminderKind,
} from '../../config/onboardingStore';
import OnboardingHeader from '../../components/onboarding/OnboardingHeader';
import GradientButton from '../../components/auth/GradientButton';
import FormBanner from '../../components/auth/FormBanner';

type Icon = ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

const REMINDERS: { value: ReminderKind; label: string; detail: string; diabetesOnly?: boolean }[] = [
  { value: 'medication', label: 'Medicamentos', detail: 'En los horarios que tú confirmes' },
  { value: 'glucose', label: 'Registro de glucosa', detail: 'Según tu plan de medición', diabetesOnly: true },
  { value: 'hydration', label: 'Hidratación', detail: 'A la frecuencia que prefieras' },
  { value: 'appointments', label: 'Citas y controles médicos', detail: 'Con las fechas que tengas' },
];

const CHANNELS: { value: NotifyChannel; label: string }[] = [
  { value: 'in_app', label: 'Notificaciones en la aplicación' },
  { value: 'sms', label: 'Mensaje de texto (SMS)' },
  { value: 'email', label: 'Correo electrónico' },
];

export default function PlanScreen() {
  const { theme } = useAppTheme();

  const [hasDiabetes, setHasDiabetes] = useState(false);
  const [reminders, setReminders] = useState<ReminderKind[]>([]);
  const [noReminders, setNoReminders] = useState(false);
  const [channels, setChannels] = useState<NotifyChannel[]>([]);
  const [teamContact, setTeamContact] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOnboarding().then(({ conditions, glucose, plan }) => {
      setHasDiabetes(conditions?.includes('diabetes') ?? false);
      if (plan) {
        setReminders(plan.reminders);
        setNoReminders(plan.reminders.length === 0);
        setChannels(plan.channels);
        setTeamContact(plan.teamContact);
      } else if (glucose?.reminders === 'yes') {
        // Ya dijo en el paso de glucosa que quiere recordatorios.
        setReminders(['glucose']);
      }
    });
  }, []);

  const reminderOptions = REMINDERS.filter((r) => hasDiabetes || !r.diabetesOnly);
  const wantsReminders = reminders.length > 0;
  const canContinue =
    (wantsReminders ? channels.length > 0 : noReminders) && teamContact !== null;

  function toggleReminder(r: ReminderKind) {
    setNoReminders(false);
    setReminders((list) => (list.includes(r) ? list.filter((x) => x !== r) : [...list, r]));
  }

  function chooseNoReminders() {
    setReminders([]);
    setChannels([]);
    setNoReminders(true);
  }

  function toggleChannel(c: NotifyChannel) {
    setChannels((list) => (list.includes(c) ? list.filter((x) => x !== c) : [...list, c]));
  }

  async function handleContinue() {
    if (!canContinue) return;
    setError(null);
    setSaving(true);
    try {
      await savePlan({ reminders, channels: wantsReminders ? channels : [], teamContact: teamContact! });
      router.push('/review');
    } catch {
      setError('No se pudo guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
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

  function Row({
    label,
    detail,
    selected,
    kind,
    onPress,
  }: {
    label: string;
    detail?: string;
    selected: boolean;
    kind: 'check' | 'radio';
    onPress: () => void;
  }) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole={kind === 'check' ? 'checkbox' : 'radio'}
        accessibilityState={kind === 'check' ? { checked: selected } : { selected }}
        style={[styles.row, selected && { borderColor: theme.accent, backgroundColor: theme.accentLight }]}
      >
        {kind === 'check' ? (
          <View
            style={[
              styles.checkbox,
              { borderColor: selected ? theme.accent : '#CBD5E1' },
              selected && { backgroundColor: theme.accent },
            ]}
          >
            {selected && <Check size={13} color="#fff" strokeWidth={3} />}
          </View>
        ) : (
          <View style={[styles.radio, { borderColor: selected ? theme.accent : '#CBD5E1' }]}>
            {selected && <View style={[styles.radioDot, { backgroundColor: theme.accent }]} />}
          </View>
        )}
        <View style={{ flex: 1 }}>
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
          <OnboardingHeader step={8} />

          <Text style={styles.title}>Tu plan personal</Text>
          <Text style={styles.subtitle}>Elige qué recordatorios quieres y cómo prefieres recibir apoyo.</Text>

          {error && <FormBanner type="error" message={error} />}

          <View style={[styles.card, Shadow.sm]}>
            <SectionHeader icon={AlarmClock} title="¿Qué recordatorios quieres?" subtitle="Elige los que te sirvan." />
            {reminderOptions.map((r) => (
              <Row
                key={r.value}
                kind="check"
                label={r.label}
                detail={r.detail}
                selected={reminders.includes(r.value)}
                onPress={() => toggleReminder(r.value)}
              />
            ))}
            <View style={styles.divider} />
            <Row kind="radio" label="No quiero recordatorios" selected={noReminders} onPress={chooseNoReminders} />
          </View>

          {wantsReminders && (
            <View style={[styles.card, Shadow.sm]}>
              <SectionHeader icon={BellRing} title="¿Cómo prefieres recibir los avisos?" subtitle="Puedes elegir más de uno." />
              {CHANNELS.map((c) => (
                <Row
                  key={c.value}
                  kind="check"
                  label={c.label}
                  selected={channels.includes(c.value)}
                  onPress={() => toggleChannel(c.value)}
                />
              ))}
            </View>
          )}

          <View style={[styles.card, Shadow.sm]}>
            <SectionHeader
              icon={HeartHandshake}
              title="¿Necesitas apoyo del equipo?"
              subtitle="El equipo puede comunicarse contigo."
            />
            <Row kind="radio" label="Sí, quiero que me contacten" selected={teamContact === true} onPress={() => setTeamContact(true)} />
            <Row kind="radio" label="No por ahora" selected={teamContact === false} onPress={() => setTeamContact(false)} />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          <GradientButton title="Revisar respuestas" onPress={handleContinue} loading={saving} disabled={!canContinue} />
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
    minHeight: 46,
    backgroundColor: '#fff',
  },
  rowLabel: { fontSize: FontSize.md, fontWeight: '600', color: '#0F172A' },
  rowDetail: { fontSize: FontSize.sm, color: '#64748B', marginTop: 2 },
  checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: Spacing[1] },
  footer: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});