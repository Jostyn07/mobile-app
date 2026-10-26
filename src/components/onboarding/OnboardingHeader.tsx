import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { BorderRadius, FontSize, Spacing } from '../../constants/theme';

export const ONBOARDING_TOTAL_STEPS = 8;

type Props = {
  step: number;
  onBack?: () => void;
};

export default function OnboardingHeader({ step, onBack }: Props) {
  const { theme } = useAppTheme();

  function handleBack() {
    if (onBack) return onBack();
    if (router.canGoBack()) router.back();
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <TouchableOpacity onPress={handleBack} hitSlop={12} style={styles.back}>
          <ChevronLeft size={24} color={theme.accent} strokeWidth={2} />
        </TouchableOpacity>
        <Image
          source={require('../../../assets/images/logos.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.back} />
      </View>

      <Text style={styles.step}>
        Paso {step} de {ONBOARDING_TOTAL_STEPS}
      </Text>

      <View style={styles.progress}>
        {Array.from({ length: ONBOARDING_TOTAL_STEPS }, (_, i) => (
          <View
            key={i}
            style={[
              styles.segment,
              { backgroundColor: i < step ? theme.accent : theme.accentLight },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: Spacing[5],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
    width: 32,
  },
  logo: {
    width: 150,
    height: 36,
  },
  step: {
    fontSize: FontSize.xs,
    color: '#64748B',
    textAlign: 'center',
    marginTop: Spacing[2],
    marginBottom: Spacing[2],
  },
  progress: {
    flexDirection: 'row',
    gap: Spacing[1],
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: BorderRadius.full,
  },
});