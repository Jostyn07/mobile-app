import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { BorderRadius, FontSize, Spacing } from '../../constants/theme';

type Props = {
  label: string;
  detail?: string;
  checked: boolean;
  onPress: () => void;
};

export default function CheckRow({ label, detail, checked, onPress }: Props) {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      style={[
        styles.row,
        checked
          ? { borderColor: theme.accent, backgroundColor: theme.accentLight }
          : { borderColor: '#E2E8F0' },
      ]}
    >
      <View style={styles.text}>
        <Text style={styles.label}>{label}</Text>
        {detail ? <Text style={styles.detail}>{detail}</Text> : null}
      </View>
      <View
        style={[
          styles.box,
          { borderColor: checked ? theme.accent : '#CBD5E1' },
          checked && { backgroundColor: theme.accent },
        ]}
      >
        {checked && <Check size={14} color="#fff" strokeWidth={3} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[3],
    marginBottom: Spacing[2],
  },
  text: {
    flex: 1,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: '#0F172A',
  },
  detail: {
    fontSize: FontSize.sm,
    color: '#64748B',
    marginTop: 2,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});