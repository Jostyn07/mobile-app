import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut } from 'lucide-react-native';
import { signOut } from '../../config/authService';
import { BrandColors, BorderRadius, FontSize, Spacing } from '../../constants/theme';

export default function ProfileScreen() {
  function doSignOut() {
    signOut();
    router.replace('/login');
  }

  function handleSignOut() {
    if (Platform.OS === 'web') return doSignOut();
    Alert.alert('Cerrar sesión', '¿Quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: doSignOut },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Perfil</Text>

        <TouchableOpacity style={styles.signOut} onPress={handleSignOut} activeOpacity={0.85}>
          <LogOut size={18} color={BrandColors.emergencia} strokeWidth={2} />
          <Text style={styles.signOutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing[6],
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: '700',
    color: BrandColors.verdeYTC,
  },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[5],
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  signOutText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: BrandColors.emergencia,
  },
});