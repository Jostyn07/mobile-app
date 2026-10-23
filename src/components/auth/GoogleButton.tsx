import { useState } from 'react';
import { TouchableOpacity, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { signInWithGoogle, GoogleNotConfiguredError } from '../../config/googleAuth';
import { BorderRadius, FontSize, Spacing } from '../../constants/theme';

type Props = {
  label?: string;
  onError: (message: string) => void;
};

export default function GoogleButton({ label = 'Continuar con Google', onError }: Props) {
  const [loading, setLoading] = useState(false);

  async function handlePress() {
    setLoading(true);
    try {
      const ok = await signInWithGoogle();
      if (ok) router.replace('/(tabs)');
    } catch (err: any) {
      onError(
        err instanceof GoogleNotConfiguredError
          ? 'El acceso con Google aún no está disponible.'
          : /network/i.test(err?.message ?? '')
            ? 'Sin conexión. Revisa tu internet e intenta de nuevo.'
            : 'No se pudo continuar con Google. Intenta de nuevo.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableOpacity
      style={styles.btn}
      activeOpacity={0.85}
      onPress={handlePress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#334155" />
      ) : (
        <>
          <Image
            source={require('../../../assets/images/googleIcon.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.text}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.md,
    height: 52,
    width: '100%',
    backgroundColor: '#fff',
  },
  icon: {
    width: 18,
    height: 18,
  },
  text: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: '#334155',
  },
});