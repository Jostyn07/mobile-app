import { useEffect, useRef, useState, type ComponentType } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TestTube, Eye, Bean, Footprints } from 'lucide-react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { BorderRadius, FontSize, Spacing, Layout, Shadow } from '../../constants/theme';
import {
  getOnboarding,
  saveLabs,
  type LabKind,
  type LabRecord,
  type LabRecords,
  type LabStatus,
} from '../../config/onboardingStore';
import OnboardingHeader from '../../components/onboarding/OnboardingHeader';
import GradientButton from '../../components/auth/GradientButton';
import FormBanner from '../../components/auth/FormBanner';
import MonthYearPicker from '../../components/form/MonthYearPicker';
import {
  ScrollIntoViewProvider,
  useScrollIntoViewHost,
  useKeyboardVisible,
  type ViewRef,
} from '../../components/form/ScrollIntoView';

type Icon = ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

type SectionDef = {
  kind: LabKind;
  icon: Icon;
  title: string;
  question: string;
  hasLabel: string;
  noDataLabel: string;
  value?: { placeholder: string; numeric?: boolean };
};

const SECTIONS: SectionDef[] = [
  {
    kind: 'hba1c',
    icon: TestTube,
    title: 'Hemoglobina glicosilada (HbA1c)',
    question: '¿Tienes el resultado de tu último examen?',
    hasLabel: 'Sí, tengo el resultado',
    noDataLabel: 'Me hice el examen, no recuerdo el resultado',
    value: { placeholder: 'Resultado (%)', numeric: true },
  },
  {
    kind: 'eye',
    icon: Eye,
    title: 'Control de ojos',
    question: '¿Te has hecho un examen de ojos?',
    hasLabel: 'Sí, tengo la fecha',
    noDataLabel: 'Me hice el control, no recuerdo la fecha',
  },
  {
    kind: 'kidney',
    icon: Bean,
    title: 'Control de riñones',
    question: '¿Te han hecho exámenes de orina o de sangre para los riñones?',
    hasLabel: 'Sí, tengo resultados',
    noDataLabel: 'Me hicieron el control, no recuerdo el resultado',
    value: { placeholder: 'Resultado (si lo sabes)' },
  },
  {
    kind: 'feet',
    icon: Footprints,
    title: 'Control de pies',
    question: '¿Te han revisado los pies y la sensibilidad?',
    hasLabel: 'Sí, tengo la fecha',
    noDataLabel: 'Me hicieron el control, no recuerdo la fecha',
  },
];

const EMPTY: LabRecord = { status: 'unsure', date: null, value: '' };

// HbA1c en %, con punto o coma decimal (ej. 7,2).
function parseHba1c(v: string): number | null {
  const n = Number(v.replace(',', '.'));
  return Number.isFinite(n) && n >= 3 && n <= 20 ? n : null;
}

function Radio({ selected, color }: { selected: boolean; color: string }) {
  return (
    <View style={[styles.radio, { borderColor: selected ? color : '#CBD5E1' }]}>
      {selected && <View style={[styles.radioDot, { backgroundColor: color }]} />}
    </View>
  );
}

export default function LabsScreen() {
  const { theme } = useAppTheme();
  const { scrollRef, contentRef, scrollTo } = useScrollIntoViewHost();
  const keyboardVisible = useKeyboardVisible();
  const detailRefs = useRef<Partial<Record<LabKind, ViewRef | null>>>({});

  // null = sin responder
  const [records, setRecords] = useState<Record<LabKind, LabRecord | null>>({
    hba1c: null, eye: null, kidney: null, feet: null,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOnboarding().then(({ labs }) => labs && setRecords(labs));
  }, []);

  function update(kind: LabKind, patch: Partial<LabRecord>) {
    setRecords((r) => ({ ...r, [kind]: { ...(r[kind] ?? EMPTY), ...patch } }));
  }

  function chooseStatus(kind: LabKind, status: LabStatus) {
    // Fecha y resultado solo se guardan si dice que tiene el dato.
    update(kind, status === 'has_data' ? { status } : { status, date: null, value: '' });
  }

  const hba1c = records.hba1c;
  const hba1cInvalid = hba1c?.status === 'has_data' && hba1c.value.trim() !== '' && parseHba1c(hba1c.value) === null;
  const canContinue = SECTIONS.every((s) => records[s.kind] !== null) && !hba1cInvalid;

  async function handleContinue() {
    if (!canContinue) return;
    setError(null);
    setSaving(true);
    try {
      const clean = Object.fromEntries(
        SECTIONS.map(({ kind }) => {
          const r = records[kind]!;
          return [kind, { ...r, value: kind === 'hba1c' ? r.value.trim().replace(',', '.') : r.value.trim() }];
        }),
      ) as LabRecords;
      await saveLabs(clean);
      router.push('/safety');
    } catch {
      setError('No se pudo guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[styles.container, keyboardVisible && styles.containerKeyboard]}
          keyboardShouldPersistTaps="handled"
        >
          <ScrollIntoViewProvider value={scrollTo}>
            <View ref={contentRef} collapsable={false} style={styles.content}>
              <OnboardingHeader step={6} />

              <Text style={styles.title}>Laboratorios y controles</Text>
              <Text style={styles.subtitle}>
                Registra tus últimos exámenes y controles. Si no recuerdas un dato, puedes indicarlo.
              </Text>

              {error && <FormBanner type="error" message={error} />}

              {SECTIONS.map((s) => {
                const r = records[s.kind];
                const I = s.icon;
                const options: { value: LabStatus; label: string }[] = [
                  { value: 'has_data', label: s.hasLabel },
                  { value: 'done_no_data', label: s.noDataLabel },
                  { value: 'not_done', label: 'No lo he realizado' },
                  { value: 'unsure', label: 'No estoy seguro/a' },
                ];
                return (
                  <View key={s.kind} style={[styles.card, Shadow.sm]}>
                    <View style={styles.sectionHeader}>
                      <View style={[styles.bubble, { backgroundColor: theme.accentLight }]}>
                        <I size={16} color={theme.accent} strokeWidth={2} />
                      </View>
                      <Text style={styles.sectionTitle}>{s.title}</Text>
                    </View>
                    <Text style={styles.question}>{s.question}</Text>

                    {options.map((o) => {
                      const selected = r?.status === o.value;
                      return (
                        <TouchableOpacity
                          key={o.value}
                          onPress={() => chooseStatus(s.kind, o.value)}
                          activeOpacity={0.8}
                          accessibilityRole="radio"
                          accessibilityState={{ selected }}
                          style={[styles.row, selected && { borderColor: theme.accent, backgroundColor: theme.accentLight }]}
                        >
                          <Radio selected={selected} color={theme.accent} />
                          <Text style={styles.rowLabel}>{o.label}</Text>
                        </TouchableOpacity>
                      );
                    })}

                    {r?.status === 'has_data' && (
                      <View
                        style={styles.details}
                        collapsable={false}
                        ref={(el) => {
                          detailRefs.current[s.kind] = el;
                        }}
                      >
                        {s.value && (
                          <TextInput
                            style={[styles.input, s.kind === 'hba1c' && hba1cInvalid && styles.inputError]}
                            placeholder={s.value.placeholder}
                            placeholderTextColor="#94A3B8"
                            keyboardType={s.value.numeric ? 'decimal-pad' : 'default'}
                            maxLength={s.value.numeric ? 5 : 60}
                            value={r.value}
                            onChangeText={(t) => update(s.kind, { value: t })}
                            onFocus={() => scrollTo({ current: detailRefs.current[s.kind] ?? null })}
                          />
                        )}
                        {s.kind === 'hba1c' && hba1cInvalid && (
                          <Text style={styles.errorText}>Escribe un valor entre 3 y 20.</Text>
                        )}
                        <MonthYearPicker
                          value={r.date}
                          onChange={(date) => update(s.kind, { date })}
                          placeholder="Fecha del examen"
                          yearsBack={15}
                        />
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </ScrollIntoViewProvider>
        </ScrollView>

        {!keyboardVisible && (
          <View style={[styles.footer, { backgroundColor: theme.background }]}>
            <View style={styles.content}>
              <GradientButton title="Continuar" onPress={handleContinue} loading={saving} disabled={!canContinue} />
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
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
  containerKeyboard: { paddingBottom: 320 },
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
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  bubble: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { flex: 1, fontSize: FontSize.md, fontWeight: '700', color: '#0F172A' },
  question: { fontSize: FontSize.sm, color: '#64748B' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    minHeight: 44,
    backgroundColor: '#fff',
  },
  rowLabel: { flex: 1, fontSize: FontSize.md, color: '#0F172A' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  details: { gap: Spacing[2], marginTop: Spacing[1] },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing[3],
    height: 44,
    fontSize: FontSize.md,
    color: '#0F172A',
    backgroundColor: '#fff',
  },
  inputError: { borderColor: '#B91C1C' },
  errorText: { fontSize: FontSize.sm, color: '#B91C1C' },
  footer: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});