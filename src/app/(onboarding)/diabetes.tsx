import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { BorderRadius, FontSize, Spacing, Layout, Shadow } from '../../constants/theme';
import {
  getOnboarding,
  saveDiabetesDetails,
  type DiabetesType,
  type MonthYear,
} from '../../config/onboardingStore';
import OnboardingHeader from '../../components/onboarding/OnboardingHeader';
import GradientButton from '../../components/auth/GradientButton';
import FormBanner from '../../components/auth/FormBanner';
import MonthYearPicker from '../../components/form/MonthYearPicker';

const TYPES: { value: DiabetesType; label: string }[] = [
  { value: 'type1', label: 'Diabetes tipo 1' },
  { value: 'type2', label: 'Diabetes tipo 2' },
  { value: 'unsure', label: 'No estoy seguro/a' },
];

export default function DiabetesScreen() {
  const { theme } = useAppTheme();

  const [type, setType] = useState<DiabetesType | null>(null);
  const [date, setDate] = useState<MonthYear | null>(null);
  const [dateUnknown, setDateUnknown] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si el usuario vuelve a este paso, se muestran sus respuestas anteriores.
  useEffect(() => {
    getOnboarding().then(({ diabetes }) => {
      if (!diabetes) return;
      setType(diabetes.type);
      setDate(diabetes.diagnosedAt);
      setDateUnknown(diabetes.dateUnknown);
    });
  }, []);

  function toggleDateUnknown() {
    setDateUnknown((v) => {
      if (!v) setDate(null);
      return !v;
    });
  }

  async function handleContinue() {
    if (!type) return;
    setError(null);
    setSaving(true);
    try {
      await saveDiabetesDetails({
        type,
        diagnosedAt: dateUnknown ? null : date,
        dateUnknown,
      });
      router.push('/history');
    } catch {
      setError('No se pudo guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <OnboardingHeader step={3} />

          <Text style={styles.title}>Sobre tu diagnóstico</Text>
          <Text style={styles.subtitle}>
            Usaremos tus respuestas para adaptar el seguimiento; no para diagnosticar.
          </Text>

          {error && <FormBanner type="error" message={error} />}

          <Text style={styles.question}>¿Qué tipo de diabetes te diagnosticaron?</Text>

          {TYPES.map((t) => {
            const selected = type === t.value;
            return (
              <TouchableOpacity
                key={t.value}
                onPress={() => setType(t.value)}
                activeOpacity={0.8}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={[
                  styles.option,
                  Shadow.sm,
                  selected
                    ? { borderColor: theme.accent, backgroundColor: theme.accentLight }
                    : { borderColor: '#E2E8F0' },
                ]}
              >
                <Text style={styles.optionLabel}>{t.label}</Text>
                <View style={[styles.radio, { borderColor: selected ? theme.accent : '#CBD5E1' }]}>
                  {selected && <View style={[styles.radioDot, { backgroundColor: theme.accent }]} />}
                </View>
              </TouchableOpacity>
            );
          })}

          {type && (
            <View style={styles.dateSection}>
              <Text style={styles.question}>
                Fecha aproximada del diagnóstico <Text style={styles.optional}>(opcional)</Text>
              </Text>

              <MonthYearPicker
                value={date}
                onChange={(v) => {
                  setDate(v);
                  setDateUnknown(false);
                }}
                disabled={dateUnknown}
              />

              <TouchableOpacity
                onPress={toggleDateUnknown}
                activeOpacity={0.8}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: dateUnknown }}
                style={[styles.checkRow, Shadow.sm]}
              >
                <View
                  style={[
                    styles.checkbox,
                    { borderColor: dateUnknown ? theme.accent : '#CBD5E1' },
                    dateUnknown && { backgroundColor: theme.accent },
                  ]}
                >
                  {dateUnknown && <Check size={14} color="#fff" strokeWidth={3} />}
                </View>
                <Text style={styles.checkLabel}>No recuerdo la fecha</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          <GradientButton
            title="Continuar"
            onPress={handleContinue}
            loading={saving}
            disabled={!type}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[6],
  },
  content: {
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignSelf: 'center',
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: Spacing[2],
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: '#64748B',
    lineHeight: FontSize.sm * 1.5,
    marginBottom: Spacing[5],
  },
  question: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: Spacing[3],
  },
  optional: {
    fontWeight: '400',
    color: '#64748B',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing[4],
    height: 56,
    marginBottom: Spacing[2],
  },
  optionLabel: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: '#0F172A',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dateSection: {
    marginTop: Spacing[5],
    gap: Spacing[3],
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing[4],
    height: 52,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkLabel: {
    fontSize: FontSize.md,
    color: '#0F172A',
  },
  footer: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});