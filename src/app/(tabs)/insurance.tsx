import { View, Text, StyleSheet } from 'react-native';
import { BrandColors } from '../../constants/theme';

export default function InsuranceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi seguro</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', color: BrandColors.verdeYTC },
});