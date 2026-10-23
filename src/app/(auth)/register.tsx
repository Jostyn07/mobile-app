import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react-native';
import { signUp } from '../../config/authService';
import { useAppTheme } from '../../theme/ThemeContext';
import PasswordRequirements, { isPasswordValid } from '../../components/PasswordRequirements';

function getFriendlyErrorMessage(err: any): string {
  switch (err.name) {
    case 'UsernameExistsException':
      return 'Ese correo ya está registrado. Inicia sesión o usa otro correo.';
    case 'InvalidPasswordException':
      return 'La contraseña no cumple los requisitos de seguridad. Revisa la lista de abajo.';
    case 'InvalidParameterException':
      return 'Revisa que todos los campos estén completos y correctos.';
    default:
      return err.message ?? 'Ocurrió un error. Intenta de nuevo.';
  }
}

export default function RegisterScreen() {
  const { theme } = useAppTheme();

  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleRegister() {
    setErrorMessage(null);

    if (!givenName || !familyName || !email || !password) {
      setErrorMessage('Completa todos los campos.');
      return;
    }

    if (!isPasswordValid(password)) {
      setErrorMessage('Tu contraseña todavía no cumple todos los requisitos de la lista.');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, givenName, familyName);
      router.push({ pathname: '/confirm', params: { email } });
    } catch (err: any) {
      setErrorMessage(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
    >
      <View style={styles.contentWrapper}>
        <Image
          source={require('../../../assets/images/logos.png')}
          style={styles.logosImage}
          resizeMode="contain"
        />

        <Text style={[styles.title, { color: theme.accent }]}>Crear cuenta</Text>

        {errorMessage && (
          <View style={styles.errorBanner}>
            <AlertCircle size={16} color="#DC2626" strokeWidth={2} />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        <View style={styles.inputWrapper}>
          <User size={18} color="#94A3B8" strokeWidth={2} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={givenName}
            onChangeText={setGivenName}
          />
        </View>

        <View style={styles.inputWrapper}>
          <User size={18} color="#94A3B8" strokeWidth={2} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            value={familyName}
            onChangeText={setFamilyName}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Mail size={18} color="#94A3B8" strokeWidth={2} style={styles.inputIcon} />
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
          <Lock size={18} color="#94A3B8" strokeWidth={2} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
            {showPassword
              ? <EyeOff size={18} color="#94A3B8" strokeWidth={2} />
              : <Eye size={18} color="#94A3B8" strokeWidth={2} />
            }
          </TouchableOpacity>
        </View>

        <PasswordRequirements password={password} accentColor={theme.accent} />

        <TouchableOpacity onPress={handleRegister} disabled={loading} style={styles.buttonWrapper}>
          <LinearGradient
            colors={theme.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Crear cuenta</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginHint}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.loginLink, { color: theme.accent }]}>Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 50,
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    alignItems: 'center',
  },
  logosImage: {
    width: '70%',
    height: 50,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
    flex: 1,
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
    width: '100%',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
  },
  buttonWrapper: {
    width: '100%',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginHint: {
    fontSize: 13,
    color: '#64748B',
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '700',
  },
});