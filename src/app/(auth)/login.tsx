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
import { Mail, Lock, Palette, ChevronDown } from 'lucide-react-native';
import {
  signIn,
  resendConfirmationCode,
  getAuthErrorMessage,
  isUnconfirmedError,
  normalizeEmail,
} from '../../config/authService';
import { useAppTheme } from '../../theme/ThemeContext';
import { BorderRadius, FontSize, Spacing, Layout } from '../../constants/theme';
import AuthInput from '../../components/auth/AuthInput';
import GradientButton from '../../components/auth/GradientButton';
import FormBanner from '../../components/auth/FormBanner';
import GoogleButton from '../../components/auth/GoogleButton';
import Divider from '../../components/auth/Divider';

const illustrations = {
  mujer: require('../../../assets/images/mujer.png'),
  hombre: require('../../../assets/images/hombre.png'),
} as const;

const notices: Record<string, string> = {
  confirmed: 'Cuenta confirmada. Ya puedes iniciar sesión.',
  reset: 'Contraseña actualizada. Inicia sesión con la nueva.',
};

export default function LoginScreen() {
  const { theme, toggleTheme } = useAppTheme();
  const params = useLocalSearchParams<{ email?: string; notice?: string }>();

  const [email, setEmail] = useState(params.email ?? '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const notice = !error && params.notice ? notices[params.notice] : null;

  async function handleLogin() {
    setError(null);
    if (!email.trim() || !password) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      if (isUnconfirmedError(err)) {
        await resendConfirmationCode(email).catch(() => {});
        router.push({ pathname: '/confirm', params: { email: normalizeEmail(email) } });
      } else {
        setError(getAuthErrorMessage(err));
      }
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

          <View style={styles.topBar}>
            <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
              <Palette size={14} color={theme.accent} strokeWidth={2} />
              <Text style={[styles.themeToggleText, { color: theme.accent }]}>Cambiar tema</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.langSelector}>
              <Text style={styles.langText}>Español</Text>
              <ChevronDown size={12} color="#64748B" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <Image
            source={require('../../../assets/images/logos.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={[styles.headline, { color: theme.accent }]}>{theme.headline}</Text>

          <View style={[styles.illustrationWrap, { backgroundColor: theme.illustrationBg }]}>
            <Image
              source={illustrations[theme.illustration]}
              style={styles.illustration}
              resizeMode="cover"
            />
          </View>

          {error && <FormBanner type="error" message={error} />}
          {notice && <FormBanner type="success" message={notice} />}

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
            autoComplete="password"
            textContentType="password"
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleLogin}
            returnKeyType="go"
          />

          <TouchableOpacity
            style={styles.forgotWrap}
            onPress={() => router.push({ pathname: '/recover', params: { email: email.trim() } })}
          >
            <Text style={[styles.forgotText, { color: theme.accent }]}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          <GradientButton title="Iniciar sesión" onPress={handleLogin} loading={loading} />

          <Divider label="o continúa con" />

          <GoogleButton onError={setError} />

          <View style={styles.registerRow}>
            <Text style={styles.registerHint}>¿No tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={[styles.registerLink, { color: theme.accent }]}>Regístrate</Text>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[6],
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  themeToggleText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  langSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  langText: {
    fontSize: FontSize.xs,
    color: '#64748B',
  },
  logo: {
    width: '65%',
    height: 44,
    marginBottom: Spacing[4],
  },
  headline: {
    fontSize: FontSize['2xl'],
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing[4],
    lineHeight: FontSize['2xl'] * 1.3,
  },
  illustrationWrap: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing[5],
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginBottom: Spacing[5],
  },
  forgotText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing[6],
  },
  registerHint: {
    fontSize: FontSize.sm,
    color: '#64748B',
  },
  registerLink: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
});