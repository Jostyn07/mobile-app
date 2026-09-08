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
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { confirmSignUp } from '../config/authService';
import { useAppTheme } from '../theme/ThemeContext';

export default function ConfirmScreen() {
  const { theme } = useAppTheme();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (!code) {
      Alert.alert('Falta el código', 'Revisa tu correo e ingresa el código recibido.');
      return;
    }
    setLoading(true);
    try {
      await confirmSignUp(email, code);
      Alert.alert('¡Cuenta confirmada!', 'Ya puedes iniciar sesión.');
      router.replace('/');
    } catch (err: any) {
      Alert.alert('Código incorrecto', err.message ?? 'Intenta de nuevo.');
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
          source={require('../../assets/images/logos.png')}
          style={styles.logosImage}
          resizeMode="contain"
        />

        <Text style={[styles.title, { color: theme.accent }]}>Confirma tu correo</Text>
        <Text style={styles.subtitle}>
          Enviamos un código a {email}. Ingrésalo abajo.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Código de 6 dígitos"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />

        <TouchableOpacity onPress={handleConfirm} disabled={loading} style={styles.buttonWrapper}>
          <LinearGradient
            colors={theme.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Confirmar</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
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
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    outlineStyle: 'none',
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
});