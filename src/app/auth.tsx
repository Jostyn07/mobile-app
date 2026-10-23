import { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { hasValidSession } from '../config/authService';
import { completeGoogleRedirect } from '../config/googleAuth';
import { routeAfterLogin } from '../config/postLogin';
import { BrandColors } from '../constants/theme';

// Destino de retorno del login con Google (mobileapp://auth · localhost:8081/auth).
export default function AuthCallbackScreen() {
  const params = useLocalSearchParams<{ code?: string; state?: string; error?: string }>();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    // Web: aquí se termina el login (la página volvió de Google con ?code=).
    if (Platform.OS === 'web') {
      completeGoogleRedirect(params)
        .then(() => routeAfterLogin())
        .catch(() => router.replace({ pathname: '/login', params: { error: 'google' } }));
      return;
    }

    // Móvil: el login lo completa GoogleButton; si el usuario queda aquí, se le redirige.
    const id = setTimeout(async () => {
      const loggedIn = await hasValidSession();
      if (loggedIn) await routeAfterLogin();
      else router.replace('/login');
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