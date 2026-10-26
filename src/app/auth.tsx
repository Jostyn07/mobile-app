import { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { hasValidSession } from '../config/authService';
import { completeGoogleRedirect, completeNativeRedirect } from '../config/googleAuth';
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

    // Móvil: si llegó el código aquí se canjea; si no, se espera la sesión hasta 15 s.
    let cancelled = false;
    (async () => {
      try {
        if (params.code) await completeNativeRedirect(params.code);
      } catch (err: any) {
        if (__DEV__) console.warn('[Google] /auth canje falló:', err?.message ?? err);
      }
      for (let i = 0; i < 30 && !cancelled; i++) {
        if (await hasValidSession()) {
          await routeAfterLogin();
          return;
        }
        await new Promise((r) => setTimeout(r, 500));
      }
      if (!cancelled) router.replace({ pathname: '/login', params: { error: 'google' } });
    })();
    return () => {
      cancelled = true;
    };
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