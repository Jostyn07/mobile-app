import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { confirmSignUp } from '../config/authService';

export default function ConfirmScreen() {
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
    <View style={styles.container}>
      <Text style={styles.title}>Confirma tu correo</Text>
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

      <TouchableOpacity style={styles.button} onPress={handleConfirm} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Confirmar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F5FAFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1D6FA5',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#5B7A8C',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 4,
    borderWidth: 1,
    borderColor: '#DCE7EE',
  },
  button: {
    backgroundColor: '#1D6FA5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});