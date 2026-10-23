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
import { Mail, KeyRound, Lock } from 'lucide-react-native';
import {
  forgotPassword,
  confirmNewPassword,
  getAuthErrorMessage,
  normalizeEmail,
} from '../../config/authService';
import { useAppTheme } from '../../theme/ThemeContext';
import { FontSize, Spacing, Layout } from '../../constants/theme';
import AuthInput from '../../components/auth/AuthInput';
import GradientButton from '../../components/auth/GradientButton';
import FormBanner from '../../components/auth/FormBanner';
import BackButton from '../../components/auth/BackButton';
import PasswordRequirements, { isPasswordValid } from '../../components/PasswordRequirements';
import { useCooldown } from '../../hooks/use-cooldown';

type Step = 'email' | 'reset';

export default function RecoverScreen() {
  const { theme } = useAppTheme();
  const params = useLocalSearchParams<{ email?: string }>();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState(params.email ?? '');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const cooldown = useCooldown();

  async function sendCode() {
    setError(null);
    setInfo(null);
    if (!email.trim()) {
      setError('Ingresa tu correo electrónico.');
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(email);
      if (step === 'reset') setInfo('Te enviamos un código nuevo.');
      setStep('reset');
      cooldown.start(30);
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    setError(null);
    setInfo(null);
    if (code.trim().length !== 6) {
      setError('Ingresa el código de 6 dígitos.');
      return;
    }
    if (!isPasswordValid(password)) {
      setError('Tu contraseña todavía no cumple todos los requisitos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    try {
      await confirmNewPassword(email, code, password);
      router.replace({
        pathname: '/login',
        params: { email: normalizeEmail(email), notice: 'reset' },
      });
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    if (step === 'reset') {
      setStep('email');
      setError(null);
      setInfo(null);
      setCode('');
      return;
    }
    if (router.canGoBack()) router.back();
    else router.replace('/login');
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
          <BackButton onPress={handleBack} />

          <Image
            source={require('../../../assets/images/logos.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={[styles.title, { color: theme.accent }]}>
            {step === 'email' ? 'Recuperar contraseña' : 'Crea una nueva contraseña'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 'email'
              ? 'Te enviaremos un código a tu correo.'
              : <>Código enviado a <Text style={styles.email}>{normalizeEmail(email)}</Text></>}
          </Text>

          {error && <FormBanner type="error" message={error} />}
          {info && <FormBanner type="success" message={info} />}

          {step === 'email' ? (
            <>
              <AuthInput
                icon={Mail}
                placeholder="Correo electrónico"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                value={email}
                onChangeText={setEmail}
                onSubmitEditing={sendCode}
              />
              <GradientButton title="Enviar código" onPress={sendCode} loading={loading} />
            </>
          ) : (
            <>
              <AuthInput
                icon={KeyRound}
                placeholder="Código de 6 dígitos"
                keyboardType="number-pad"
                autoComplete="one-time-code"
                textContentType="oneTimeCode"
                maxLength={6}
                value={code}
                onChangeText={(t) => setCode(t.replace(/\D/g, ''))}
                style={styles.codeInput}
              />
              <AuthInput
                icon={Lock}
                secure
                placeholder="Nueva contraseña"
                autoCapitalize="none"
                autoComplete="new-password"
                textContentType="newPassword"
                value={password}
                onChangeText={setPassword}
              />
              <AuthInput
                icon={Lock}
                secure
                placeholder="Confirmar contraseña"
                autoCapitalize="none"
                autoComplete="new-password"
                textContentType="newPassword"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <PasswordRequirements password={password} accentColor={theme.accent} />

              <GradientButton title="Cambiar contraseña" onPress={handleReset} loading={loading} />

              <TouchableOpacity
                onPress={sendCode}
                disabled={cooldown.active || loading}
                style={styles.resendWrap}
              >
                <Text style={[styles.resend, { color: cooldown.active ? '#94A3B8' : theme.accent }]}>
                  {cooldown.active ? `Reenviar código en ${cooldown.seconds}s` : 'Reenviar código'}
                </Text>
              </TouchableOpacity>
            </>
          )}
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