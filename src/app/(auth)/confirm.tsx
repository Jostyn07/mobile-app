import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { KeyRound } from 'lucide-react-native';
import {
  confirmSignUp,
  resendConfirmationCode,
  getAuthErrorMessage,
} from '../../config/authService';
import { useAppTheme } from '../../theme/ThemeContext';
import { FontSize, Spacing, Layout } from '../../constants/theme';
import AuthInput from '../../components/auth/AuthInput';
import GradientButton from '../../components/auth/GradientButton';
import FormBanner from '../../components/auth/FormBanner';
import BackButton from '../../components/auth/BackButton';
import { useCooldown } from '../../hooks/use-cooldown';

export default function ConfirmScreen() {
  const { theme } = useAppTheme();
  const { email = '' } = useLocalSearchParams<{ email: string }>();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const cooldown = useCooldown(30);

  async function handleConfirm() {
    setError(null);
    setInfo(null);
    if (code.trim().length !== 6) {
      setError('Ingresa el código de 6 dígitos.');
      return;
    }
    setLoading(true);
    try {
      await confirmSignUp(email, code);
      router.replace({ pathname: '/login', params: { email, notice: 'confirmed' } });
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError(null);
    setInfo(null);
    try {
      await resendConfirmationCode(email);
      setInfo('Te enviamos un código nuevo.');
      cooldown.start(30);
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <BackButton />

          <Image
            source={require('../../../assets/images/logos.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={[styles.title, { color: theme.accent }]}>Confirma tu correo</Text>
          <Text style={styles.subtitle}>
            Enviamos un código a <Text style={styles.email}>{email}</Text>
          </Text>

          {error && <FormBanner type="error" message={error} />}
          {info && <FormBanner type="success" message={info} />}

          <AuthInput
            icon={KeyRound}
            placeholder="Código de 6 dígitos"
            keyboardType="number-pad"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            maxLength={6}
            value={code}
            onChangeText={(t) => setCode(t.replace(/\D/g, ''))}
            onSubmitEditing={handleConfirm}
            style={styles.codeInput}
          />

          <GradientButton title="Confirmar" onPress={handleConfirm} loading={loading} />

          <TouchableOpacity
            onPress={handleResend}
            disabled={cooldown.active}
            style={styles.resendWrap}
          >
            <Text style={[styles.resend, { color: cooldown.active ? '#94A3B8' : theme.accent }]}>
              {cooldown.active ? `Reenviar código en ${cooldown.seconds}s` : 'Reenviar código'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[12],
    paddingBottom: Spacing[8],
  },
  content: {
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignSelf: 'center',
  },
  logo: {
    width: '65%',
    height: 44,
    marginBottom: Spacing[6],
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: '700',
    marginBottom: Spacing[2],
  },
  subtitle: {
    fontSize: FontSize.md,
    color: '#64748B',
    marginBottom: Spacing[5],
  },
  email: {
    fontWeight: '700',
    color: '#334155',
  },
  codeInput: {
    fontSize: FontSize.xl,
    letterSpacing: 6,
  },
  resendWrap: {
    alignSelf: 'center',
    marginTop: Spacing[5],
    padding: Spacing[2],
  },
  resend: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
});