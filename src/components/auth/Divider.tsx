import { View, Text, StyleSheet } from 'react-native';
import { FontSize, Spacing } from '../../constants/theme';

export default function Divider({ label }: { label: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text style={styles.text}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing[5],
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  text: {
    fontSize: FontSize.xs,
    color: '#94A3B8',
    marginHorizontal: Spacing[3],
  },
});