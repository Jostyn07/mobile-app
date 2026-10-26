import { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Check } from 'lucide-react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { BorderRadius, FontSize, Spacing, Layout, Shadow } from '../../constants/theme';
import { CONDITIONS, type ConditionId } from '../../content/conditions';
import { getOnboarding, saveConditions } from '../../config/onboardingStore';
import OnboardingHeader from '../../components/onboarding/OnboardingHeader';
import GradientButton from '../../components/auth/GradientButton';
import FormBanner from '../../components/auth/FormBanner';

// Búsqueda sin tildes ni mayúsculas ("tiroídes" encuentra "tiroides").
function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export default function DiagnosisScreen() {
  const { theme } = useAppTheme();

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<ConditionId[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si el usuario vuelve a este paso, se muestran sus selecciones anteriores.
  useEffect(() => {
    getOnboarding().then((s) => setSelected(s.conditions ?? []));
  }, []);

  const visible = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return CONDITIONS;
    return CONDITIONS.filter((c) => normalize(`${c.name} ${c.detail}`).includes(q));
  }, [query]);

  function toggle(id: ConditionId) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleContinue() {
    if (selected.length === 0) return;
    setError(null);
    setSaving(true);
    try {
      await saveConditions(selected);
      router.push('/history');
    } catch {
      setError('No se pudo guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <OnboardingHeader step={2} />

          <Text style={styles.title}>¿Qué condición deseas registrar?</Text>
          <Text style={styles.subtitle}>
            Puedes elegir más de una. Adaptaremos tu seguimiento a lo que selecciones.
          </Text>

          {error && <FormBanner type="error" message={error} />}

          <View style={[styles.search, Shadow.sm]}>
            <Search size={18} color="#94A3B8" strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar condición"
              placeholderTextColor="#94A3B8"
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
            />
          </View>

          {visible.length === 0 && (
            <Text style={styles.empty}>No encontramos esa condición. Elige “Otra condición”.</Text>
          )}

          {visible.map((c) => {
            const isOn = selected.includes(c.id);
            const Icon = c.icon;
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => toggle(c.id)}
                activeOpacity={0.8}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isOn }}
                style={[
                  styles.item,
                  Shadow.sm,
                  isOn
                    ? { borderColor: theme.accent, backgroundColor: theme.accentLight }
                    : { borderColor: '#E2E8F0' },
                ]}
              >
                <View style={[styles.iconBox, { backgroundColor: isOn ? '#fff' : theme.accentLight }]}>
                  <Icon size={18} color={theme.accent} strokeWidth={2} />
                </View>
                <View style={styles.itemText}>
                  <Text style={styles.itemName}>{c.name}</Text>
                  <Text style={styles.itemDetail}>{c.detail}</Text>
                </View>
                <View
                  style={[
                    styles.checkbox,
                    { borderColor: isOn ? theme.accent : '#CBD5E1' },
                    isOn && { backgroundColor: theme.accent },
                  ]}
                >
                  {isOn && <Check size={14} color="#fff" strokeWidth={3} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          <GradientButton
            title={selected.length > 1 ? `Continuar (${selected.length})` : 'Continuar'}
            onPress={handleContinue}
            loading={saving}
            disabled={selected.length === 0}
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
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing[4],
    height: 52,
    marginBottom: Spacing[4],
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: '#0F172A',
  },
  empty: {
    fontSize: FontSize.sm,
    color: '#64748B',
    textAlign: 'center',
    marginVertical: Spacing[4],
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[3],
    marginBottom: Spacing[2],
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    flex: 1,
  },
  itemName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: '#0F172A',
  },
  itemDetail: {
    fontSize: FontSize.sm,
    color: '#64748B',
    marginTop: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});