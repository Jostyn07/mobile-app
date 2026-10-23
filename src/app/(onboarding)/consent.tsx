import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText, ArrowUpRight, ExternalLink, Check, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { BorderRadius, FontSize, Spacing, Layout, Shadow } from '../../constants/theme';
import { PRIVACY_NOTICE_URL } from '../../config/legal';
import { saveConsent } from '../../config/onboardingStore';
import { signOut } from '../../config/authService';
import OnboardingHeader from '../../components/onboarding/OnboardingHeader';
import GradientButton from '../../components/auth/GradientButton';
import FormBanner from '../../components/auth/FormBanner';

type Choice = 'allow' | 'deny' | null;

const permissionDetails = [
  'Diagnóstico, medicamentos y antecedentes que registres.',
  'Mediciones de glucosa y resultados de laboratorio.',
  'Solo para darte seguimiento y acompañamiento.',
  'Puedes retirar este permiso cuando quieras.',
];

export default function ConsentScreen() {
  const { theme } = useAppTheme();

  const [ack, setAck] = useState(false);
  const [choice, setChoice] = useState<Choice>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canContinue = ack && choice !== null;

  function openPrivacyNotice() {
    if (PRIVACY_NOTICE_URL) WebBrowser.openBrowserAsync(PRIVACY_NOTICE_URL);
  }

  function handleBack() {
    signOut();
    router.replace('/login');
  }

  async function handleContinue() {
    if (!canContinue) return;
    setError(null);
    setSaving(true);
    try {
      await saveConsent(choice === 'allow');
      router.push('/diagnosis');
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
          <OnboardingHeader step={1} onBack={handleBack} />

          <Text style={styles.title}>Tus datos, bajo tu control</Text>
          <Text style={styles.subtitle}>
            Revisa cómo usamos tus datos y quién puede acceder. Tú decides los permisos opcionales.
          </Text>

          {error && <FormBanner type="error" message={error} />}

          {/* Aviso de privacidad */}
          <View style={[styles.card, Shadow.sm, { borderColor: theme.accentLight }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: theme.accentLight }]}>
                <FileText size={18} color={theme.accent} strokeWidth={2} />
              </View>
              <Text style={styles.cardTitle}>Aviso de privacidad</Text>
            </View>
            <Text style={styles.cardText}>
              Consulta qué datos recopilamos, para qué los usamos, quién puede acceder y qué derechos tienes.
            </Text>
            <TouchableOpacity onPress={openPrivacyNotice} style={styles.link}>
              <Text style={[styles.linkText, { color: theme.accent }]}>Leer aviso de privacidad</Text>
              <ExternalLink size={14} color={theme.accent} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Confirmación obligatoria */}
          <TouchableOpacity
            style={styles.checkRow}
            onPress={() => setAck((v) => !v)}
            activeOpacity={0.8}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: ack }}
          >
            <View
              style={[
                styles.checkbox,
                { borderColor: theme.accent },
                ack && { backgroundColor: theme.accent },
              ]}
            >
              {ack && <Check size={14} color="#fff" strokeWidth={3} />}
            </View>
            <Text style={styles.checkLabel}>Confirmo que recibí el Aviso de Privacidad</Text>
          </TouchableOpacity>

          {/* Permiso opcional */}
          <View style={[styles.card, Shadow.sm, { borderColor: theme.accentLight }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: theme.accentLight }]}>
                <ArrowUpRight size={18} color={theme.accent} strokeWidth={2} />
              </View>
              <Text style={[styles.cardTitle, { flex: 1 }]}>
                Permiso opcional para compartir tus datos de salud
              </Text>
            </View>
            <Text style={styles.cardText}>
              Si lo autorizas, el personal asignado y autorizado por la compañía podrá consultar los
              datos necesarios para acompañarte.
            </Text>

            <TouchableOpacity onPress={() => setShowDetails((v) => !v)} style={styles.link}>
              <Text style={[styles.linkText, { color: theme.accent }]}>Ver detalles del permiso</Text>
              {showDetails
                ? <ChevronUp size={14} color={theme.accent} strokeWidth={2} />
                : <ChevronDown size={14} color={theme.accent} strokeWidth={2} />}
            </TouchableOpacity>

            {showDetails && (
              <View style={styles.details}>
                {permissionDetails.map((d) => (
                  <View key={d} style={styles.detailRow}>
                    <View style={[styles.bullet, { backgroundColor: theme.accent }]} />
                    <Text style={styles.detailText}>{d}</Text>
                  </View>
                ))}
              </View>
            )}

            {(['allow', 'deny'] as const).map((value) => {
              const selected = choice === value;
              return (
                <TouchableOpacity
                  key={value}
                  onPress={() => setChoice(value)}
                  activeOpacity={0.8}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  style={[
                    styles.option,
                    selected
                      ? { borderColor: theme.accent, backgroundColor: theme.accentLight }
                      : { borderColor: '#E2E8F0' },
                  ]}
                >
                  <View style={[styles.radio, { borderColor: selected ? theme.accent : '#CBD5E1' }]}>
                    {selected && <View style={[styles.radioDot, { backgroundColor: theme.accent }]} />}
                  </View>
                  <Text style={styles.optionLabel}>{value === 'allow' ? 'Sí, permitir' : 'Ahora no'}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          <GradientButton
            title="Continuar"
            onPress={handleContinue}
            loading={saving}
            disabled={!canContinue}
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
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    marginBottom: Spacing[4],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[3],
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardText: {
    fontSize: FontSize.sm,
    color: '#475569',
    lineHeight: FontSize.sm * 1.5,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    marginTop: Spacing[3],
    alignSelf: 'flex-start',
  },
  linkText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[4],
    paddingVertical: Spacing[1],
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
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: '#0F172A',
  },
  details: {
    marginTop: Spacing[3],
    gap: Spacing[2],
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[2],
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 7,
  },
  detailText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: '#475569',
    lineHeight: FontSize.sm * 1.5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing[4],
    height: 52,
    marginTop: Spacing[3],
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
  optionLabel: {
    fontSize: FontSize.md,
    fontWeight: '600',
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