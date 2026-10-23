import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../theme/ThemeContext';
import { BorderRadius, FontSize, Spacing, Shadow } from '../constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BAR_WIDTH = SCREEN_WIDTH - Spacing[6] * 2;
const PROGRESS_DURATION = 1800;

export default function SplashScreen() {
  const { theme } = useAppTheme();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: PROGRESS_DURATION,
      useNativeDriver: false,
    }).start();
  }, []);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BAR_WIDTH * 0.6],
  });

  function handleStart() {
    router.replace('/(auth)/login');
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      <View style={styles.center}>
        <Image
          source={require('../../assets/images/logos.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Tu salud, nuestra prioridad</Text>
        <Text style={styles.subtitle}>
          Acompañamiento y hábitos saludables, a tu ritmo.
        </Text>

        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFill, { width: barWidth, backgroundColor: theme.accent }]} />
        </View>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          onPress={handleStart}
          activeOpacity={0.85}
          style={styles.btnWrap}
        >
          <LinearGradient
            colors={theme.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btn}
          >
            <Text style={styles.btnText}>Comenzar</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing[6],
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 64,
    marginBottom: Spacing[10],
  },
  title: {
    fontSize: FontSize['3xl'],
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: Spacing[3],
  },
  subtitle: {
    fontSize: FontSize.md,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: FontSize.md * 1.6,
    marginBottom: Spacing[8],
    paddingHorizontal: Spacing[4],
  },
  barTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: 4,
    borderRadius: BorderRadius.full,
  },
  bottom: {
    paddingBottom: Spacing[10],
  },
  btnWrap: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadow.md,
  },
  btn: {
    paddingVertical: Spacing[4],
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
  },
  btnText: {
    color: '#fff',
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
});