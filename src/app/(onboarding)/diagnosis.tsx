import { View, Text, StyleSheet } from 'react-native';
import { BrandColors } from '../../constants/theme';

export default function DiagnosisScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.phase}>Paso 2 de 8</Text>
      <Text style={styles.title}>Diagnóstico actual</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  phase: { fontSize: 12, color: '#94A3B8', marginBottom: 8, fontWeight: '600' },
  title: { fontSize: 22, fontWeight: '700', color: BrandColors.verdeYTC, textAlign: 'center' },
});