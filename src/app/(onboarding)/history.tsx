import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Droplet, Heart, Pill, TriangleAlert } from 'lucide-react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { FontSize, Spacing, Layout } from '../../constants/theme';
import { CONDITIONS, FAMILY_CONDITIONS, type ConditionId } from '../../content/conditions';
import {
  getOnboarding,
  saveHistory,
  EMPTY_HISTORY,
  type MedicalHistory,
} from '../../config/onboardingStore';
import OnboardingHeader from '../../components/onboarding/OnboardingHeader';
import GradientButton from '../../components/auth/GradientButton';
import FormBanner from '../../components/auth/FormBanner';
import Accordion from '../../components/form/Accordion';
import CheckRow from '../../components/form/CheckRow';
import MedicationsSection from '../../components/history/MedicationsSection';
import {
  ScrollIntoViewProvider,
  useScrollIntoViewHost,
  useKeyboardVisible,
} from '../../components/form/ScrollIntoView';
import AllergiesSection from '../../components/history/AllergiesSection';

type Section = 'conditions' | 'family' | 'medications' | 'allergies';

function countLabel(n: number, singular: string, plural: string) {
  return `${n} ${n === 1 ? singular : plural}`;
}

export default function HistoryScreen() {
  const { theme } = useAppTheme();
  const { scrollRef, contentRef, scrollTo } = useScrollIntoViewHost();
  const keyboardVisible = useKeyboardVisible();

  const [history, setHistory] = useState<MedicalHistory>(EMPTY_HISTORY);
  const [mainConditions, setMainConditions] = useState<ConditionId[]>([]);
  const [open, setOpen] = useState<Section | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOnboarding().then((s) => {
      setMainConditions(s.conditions ?? []);
      if (s.history) setHistory({ ...EMPTY_HISTORY, ...s.history });
    });
  }, []);

  // Las condiciones elegidas en el paso 2 no se repiten aquí.
  const otherOptions = useMemo(
    () => CONDITIONS.filter((c) => c.id !== 'other' && !mainConditions.includes(c.id)),
    [mainConditions],
  );

  function update(patch: Partial<MedicalHistory>) {
    setHistory((h) => ({ ...h, ...patch }));
  }

  function toggleSection(s: Section) {
    setOpen((cur) => (cur === s ? null : s));
  }

  function toggleOther(id: ConditionId) {
    const list = history.otherConditions;
    update({ otherConditions: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] });
  }

  function toggleFamily(name: string) {
    const list = history.familyHistory;
    update({
      familyHistory: list.includes(name) ? list.filter((x) => x !== name) : [...list, name],
      noFamilyHistory: false,
    });
  }

  const summaries: Record<Section, string | undefined> = {
    conditions: history.otherConditions.length
      ? countLabel(history.otherConditions.length, 'seleccionada', 'seleccionadas')
      : undefined,
    family: history.noFamilyHistory
      ? 'Ninguno conocido'
      : history.familyHistory.length
        ? countLabel(history.familyHistory.length, 'antecedente', 'antecedentes')
        : undefined,
    medications: history.noMedications
      ? 'No toma medicamentos'
      : history.medications.length
        ? countLabel(history.medications.length, 'medicamento', 'medicamentos')
        : undefined,
    allergies:
      history.allergyStatus === 'none_known'
        ? 'Sin alergias conocidas'
        : history.allergyStatus === 'unsure'
          ? 'No está seguro/a'
          : history.allergies.length
            ? countLabel(history.allergies.length, 'alergia', 'alergias')
            : undefined,
  };

  async function handleContinue() {
    setError(null);
    setSaving(true);
    try {
      await saveHistory(history);
      // Glucosa, laboratorios y seguridad solo aplican si marcó diabetes.
      router.push(mainConditions.includes('diabetes') ? '/glucose' : '/plan');
    } catch {
      setError('No se pudo guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[styles.container, keyboardVisible && styles.containerKeyboard]}
          keyboardShouldPersistTaps="handled"
        >
          <ScrollIntoViewProvider value={scrollTo}>
          <View ref={contentRef} collapsable={false} style={styles.content}>
            <OnboardingHeader step={4} />

            <Text style={styles.title}>Tu historial</Text>
            <Text style={styles.subtitle}>
              Queremos conocer un poco más sobre tu salud para adaptar el seguimiento a tus necesidades.
            </Text>

            {error && <FormBanner type="error" message={error} />}

            <Accordion
              icon={Droplet}
              title="Otras condiciones médicas"
              summary={summaries.conditions}
              open={open === 'conditions'}
              onToggle={() => toggleSection('conditions')}
            >
              {otherOptions.map((c) => (
                <CheckRow
                  key={c.id}
                  label={c.name}
                  detail={c.detail}
                  checked={history.otherConditions.includes(c.id)}
                  onPress={() => toggleOther(c.id)}
                />
              ))}
            </Accordion>

            <Accordion
              icon={Heart}
              title="Antecedentes familiares"
              summary={summaries.family}
              open={open === 'family'}
              onToggle={() => toggleSection('family')}
            >
              {FAMILY_CONDITIONS.map((name) => (
                <CheckRow
                  key={name}
                  label={name}
                  checked={history.familyHistory.includes(name)}
                  onPress={() => toggleFamily(name)}
                />
              ))}
              <CheckRow
                label="Ninguno conocido"
                checked={history.noFamilyHistory}
                onPress={() => update({ familyHistory: [], noFamilyHistory: !history.noFamilyHistory })}
              />
            </Accordion>

            <Accordion
              icon={Pill}
              title="Medicamentos actuales"
              summary={summaries.medications}
              open={open === 'medications'}
              onToggle={() => toggleSection('medications')}
            >
              <MedicationsSection
                medications={history.medications}
                noMedications={history.noMedications}
                onChange={(medications, noMedications) => update({ medications, noMedications })}
              />
            </Accordion>

            <Accordion
              icon={TriangleAlert}
              title="Alergias"
              summary={summaries.allergies}
              open={open === 'allergies'}
              onToggle={() => toggleSection('allergies')}
            >
              <AllergiesSection
                allergies={history.allergies}
                status={history.allergyStatus}
                onChange={(allergies, allergyStatus) => update({ allergies, allergyStatus })}
              />
            </Accordion>
          </View>
          </ScrollIntoViewProvider>
        </ScrollView>

        {!keyboardVisible && (
        <View style={[styles.footer, { backgroundColor: theme.background }]}>
          <View style={styles.content}>
            <GradientButton title="Guardar y continuar" onPress={handleContinue} loading={saving} />
          </View>
        </View>
        )}
      </KeyboardAvoidingView>
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
  containerKeyboard: {
    paddingBottom: 320, // espacio para poder subir el campo por encima del teclado
  },
  footer: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});