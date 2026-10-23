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
import { router } from 'expo-router';
import { User, Mail, Lock } from 'lucide-react-native';
import { signUp, getAuthErrorMessage, normalizeEmail } from '../../config/authService';
import { useAppTheme } from '../../theme/ThemeContext';
import { FontSize, Spacing, Layout } from '../../constants/theme';
import AuthInput from '../../components/auth/AuthInput';
import GradientButton from '../../components/auth/GradientButton';
import FormBanner from '../../components/auth/FormBanner';
import BackButton from '../../components/auth/BackButton';
import GoogleButton from '../../components/auth/GoogleButton';
import Divider from '../../components/auth/Divider';
import PasswordRequirements, { isPasswordValid } from '../../components/PasswordRequirements';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const { theme } = useAppTheme();

  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    setError(null);

    if (!givenName.trim() || !familyName.trim() || !email.trim() || !password) {
      setError('Completa todos los campos.');
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError('El correo no tiene un formato válido.');
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
      await signUp(email, password, givenName, familyName);
      router.push({ pathname: '/confirm', params: { email: normalizeEmail(email) } });
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
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

          <Text style={[styles.title, { color: theme.accent }]}>Crear cuenta</Text>

          {error && <FormBanner type="error" message={error} />}

          <GoogleButton label="Registrarme con Google" onError={setError} />

          <Divider label="o con tu correo" />

          <AuthInput
            icon={User}
            placeholder="Nombre"
            autoCapitalize="words"
            autoComplete="given-name"
            textContentType="givenName"
            value={givenName}
            onChangeText={setGivenName}
          />
          <AuthInput
            icon={User}
            placeholder="Apellido"
            autoCapitalize="words"
            autoComplete="family-name"
            textContentType="familyName"
            value={familyName}
            onChangeText={setFamilyName}
          />
          <AuthInput
            icon={Mail}
            placeholder="Correo electrónico"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
          />
          <AuthInput
            icon={Lock}
            secure
            placeholder="Contraseña"
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

          <GradientButton title="Crear cuenta" onPress={handleRegister} loading={loading} />

          <View style={styles.loginRow}>
            <Text style={styles.loginHint}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text style={[styles.loginLink, { color: theme.accent }]}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: Spacing[5],
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing[6],
  },
  loginHint: {
    fontSize: FontSize.sm,
    color: '#64748B',
  },
  loginLink: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
});