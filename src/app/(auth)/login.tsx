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
  Image,
} from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff, Palette, ChevronDown } from 'lucide-react-native';
import { signIn } from '../../config/authService';
import { useAppTheme } from '../../theme/ThemeContext';
import { BorderRadius, FontSize, Spacing, Layout, Shadow } from '../../constants/theme';

const illustrations = {
  mujer: require('../../../assets/images/mujer.png'),
  hombre: require('../../../assets/images/hombre.png'),
} as const;

export default function LoginScreen() {
  const { theme, toggleTheme } = useAppTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Faltan datos', 'Ingresa tu correo y contraseña.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/home');
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

        <View style={[styles.inputRow, Shadow.sm]}>
          <Mail size={18} color="#94A3B8" strokeWidth={2} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={[styles.inputRow, Shadow.sm]}>
          <Lock size={18} color="#94A3B8" strokeWidth={2} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#94A3B8"
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

        <TouchableOpacity style={styles.forgotWrap}>
          <Text style={[styles.forgotText, { color: theme.accent }]}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={styles.btnWrap}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={theme.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btn}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Iniciar sesión</Text>
            }
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o continúa con</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.googleBtn}
          activeOpacity={0.85}
          onPress={() => Alert.alert('Próximamente', 'El acceso con Google estará disponible pronto.')}
        >
          <View style={styles.googleIconSlot} />
          <Text style={styles.googleText}>Continuar con Google</Text>
        </TouchableOpacity>

        <View style={styles.registerRow}>
          <Text style={styles.registerHint}>¿No tienes una cuenta? </Text>
          <Link href="/(auth)/register">
            <Text style={[styles.registerLink, { color: theme.accent }]}>Regístrate</Text>
          </Link>
        </View>

      </View>
    </ScrollView>
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing[4],
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: Spacing[3],
    height: 52,
  },
  inputIcon: {
    marginRight: Spacing[2],
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: '#0F172A',
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginBottom: Spacing[5],
  },
  forgotText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  btnWrap: {
    width: '100%',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  btn: {
    paddingVertical: Spacing[4],
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  btnText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing[5],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: FontSize.xs,
    color: '#94A3B8',
    marginHorizontal: Spacing[3],
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing[3] + 2,
    backgroundColor: '#fff',
  },
  googleIconSlot: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
  },
  googleText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: '#334155',
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