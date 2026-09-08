import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { signIn } from '../config/authService';
import { themes, ThemeName } from '../theme/themes';

export default function LoginScreen() {
  const [themeName, setThemeName] = useState<ThemeName>('pink');
  const theme = themes[themeName];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function toggleTheme() {
    setThemeName((current) => (current === 'pink' ? 'blue' : 'pink'));
  }

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Faltan datos', 'Ingresa tu correo y contraseña.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/');
    } catch (err: any) {
      Alert.alert('No se pudo iniciar sesión', err.message ?? 'Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
    >
      {/* Barra superior: cambiar tema + idioma */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <Ionicons name="color-palette-outline" size={16} color={theme.accent} />
          <Text style={[styles.themeToggleText, { color: theme.accent }]}>Cambiar tema</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.langSelector}>
          <Text style={styles.langText}>Español</Text>
          <Ionicons name="chevron-down" size={14} color="#5B7A8C" />
        </TouchableOpacity>
      </View>

      {/* Logos */}
      <View style={styles.logosRow}>
        <Text style={styles.astraLogo}>Astra</Text>
        <View style={styles.logoDivider} />
        <View>
          <Text style={[styles.appName, { color: theme.accent }]}>Yo te cuido</Text>
          <Text style={styles.appTagline}>Tu salud, nuestra prioridad</Text>
        </View>
      </View>

      {/* Titular */}
      <Text style={[styles.headline, { color: theme.accent }]}>{theme.headline}</Text>

      {/* Placeholder de ilustración — reemplazar con el arte real cuando esté listo */}
      <View style={[styles.illustration, { backgroundColor: theme.illustrationBg }]}>
        <Ionicons name="water" size={40} color={theme.accent} />
        <Text style={styles.illustrationHint}>Ilustración pendiente</Text>
      </View>

      {/* Campos */}
      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={18}
            color="#94A3B8"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.forgotLink}>
        <Text style={[styles.forgotText, { color: theme.accent }]}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      {/* Botón de login con degradado */}
      <TouchableOpacity onPress={handleLogin} disabled={loading}>
        <LinearGradient
          colors={theme.gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.loginButton}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Divisor */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>o continúa con</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Google (visual, todavía no conectado) */}
      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => Alert.alert('Próximamente', 'El login con Google se conecta en un paso aparte.')}
      >
        <Ionicons name="logo-google" size={18} color="#334155" />
        <Text style={styles.googleButtonText}>Continuar con Google</Text>
      </TouchableOpacity>

      <View style={styles.registerRow}>
        <Text style={styles.registerHint}>¿No tienes una cuenta? </Text>
        <Link href="/register">
          <Text style={[styles.registerLink, { color: theme.accent }]}>Regístrate</Text>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 50,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  themeToggleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  langSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  langText: {
    fontSize: 12,
    color: '#5B7A8C',
  },
  logosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  astraLogo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563EB',
  },
  logoDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 12,
  },
  appName: {
    fontSize: 16,
    fontWeight: '700',
  },
  appTagline: {
    fontSize: 10,
    color: '#94A3B8',
  },
  headline: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  illustration: {
    height: 160,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  illustrationHint: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 11,
    color: '#94A3B8',
    marginHorizontal: 10,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerHint: {
    fontSize: 13,
    color: '#64748B',
  },
  registerLink: {
    fontSize: 13,
    fontWeight: '700',
  },
});