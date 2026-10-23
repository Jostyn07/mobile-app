import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../theme/ThemeContext';
import { BorderRadius, FontSize, Spacing } from '../../constants/theme';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export default function GradientButton({ title, onPress, loading, disabled }: Props) {
  const { theme } = useAppTheme();
  const inactive = loading || disabled;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={inactive}
      activeOpacity={0.85}
      style={[styles.wrap, inactive && styles.inactive]}
    >
      <LinearGradient
        colors={theme.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.btn}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.text}>{title}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  inactive: {
    opacity: 0.7,
  },
  btn: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  text: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});