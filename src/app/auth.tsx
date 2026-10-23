import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { hasValidSession } from '../config/authService';
import { BrandColors } from '../constants/theme';

// Destino de retorno del login con Google (mobileapp://auth · localhost:8081/auth).
// Web: entrega el código a la ventana principal y cierra la ventana emergente.
// Móvil: el login lo completa GoogleButton; si el usuario queda aquí, se le redirige.
WebBrowser.maybeCompleteAuthSession();

export default function AuthCallbackScreen() {
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const id = setTimeout(async () => {
      const loggedIn = await hasValidSession();
      router.replace(loggedIn ? '/(tabs)' : '/login');
    }, 1500);
    return () => clearTimeout(id);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={BrandColors.verdeYTC} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});