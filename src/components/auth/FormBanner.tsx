import { View, Text, StyleSheet } from 'react-native';
import { AlertCircle, CheckCircle2 } from 'lucide-react-native';
import { BorderRadius, FontSize, Spacing } from '../../constants/theme';

type Props = {
  type: 'error' | 'success';
  message: string;
};

const palette = {
  error: { bg: '#FEF2F2', border: '#FCA5A5', text: '#B91C1C', Icon: AlertCircle },
  success: { bg: '#ECFDF5', border: '#6EE7B7', text: '#047857', Icon: CheckCircle2 },
} as const;

export default function FormBanner({ type, message }: Props) {
  const c = palette[type];
  return (
    <View style={[styles.banner, { backgroundColor: c.bg, borderColor: c.border }]}>
      <c.Icon size={16} color={c.text} strokeWidth={2} />
      <Text style={[styles.text, { color: c.text }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    padding: Spacing[3],
    marginBottom: Spacing[4],
    width: '100%',
  },
  text: {
    flex: 1,
    fontSize: FontSize.sm,
  },
});