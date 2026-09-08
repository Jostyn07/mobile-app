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
import { router } from 'expo-router';
import { signUp } from '../config/authService';

export default function RegisterScreen() {
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!givenName || !familyName || !email || !password) {
      Alert.alert('Faltan datos', 'Completa todos los campos.');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, givenName, familyName);
      // Pasamos el correo a la siguiente pantalla para pedir el código de confirmación.
      router.push({ pathname: '/confirm', params: { email } });
    } catch (err: any) {
      Alert.alert('No se pudo registrar', err.message ?? 'Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={givenName}
        onChangeText={setGivenName}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={familyName}
        onChangeText={setFamilyName}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Text style={styles.hint}>
        Mínimo 8 caracteres, con mayúscula, minúscula, número y símbolo.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Crear cuenta</Text>
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
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1D6FA5',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DCE7EE',
  },
  hint: {
    fontSize: 12,
    color: '#5B7A8C',
    marginBottom: 20,
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