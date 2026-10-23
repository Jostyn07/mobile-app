/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

// Paleta de marca yo te cuido
export const BrandColors = {
  verdeYTC: '#0A9E8A',
  verdeOscuro: '#07796A',
  verdeClaro: '#E8F9F6',
  verdeMedio: '#0BBD9E',
  blanco: '#FFFFFF',
  grisClaro: '#F4F6F8',
  grisMedio: 'E2E8F0',
  grisTexto: '#64748B',
  grisOscuro: '#334155',
  negro: '#0F172A',
  emergencia: '#B91C1C',
  urgente: '#D97706',
  exito: '#15803D',
  info: '#0369A1',
} as const;

export const Colors = {
  light: {
    text: '#0F172A',
    background: '#ffffff',
    backgroundSecondary: 'FAF6F8',
    backgroundElement: '#E8F9F6',
    backgroundSelected: '#D1F5EF',
    surface:'#0F172A',
    textSecondary: '#60646C',
    textInverse: '#FFFFFF',
    textMuted: '#94A3B8',
    primary: '#0A9E8A',
    primaryDark: '#07796A',
    primaryLight: '#E8F9F6',
    border: '#E2E8F0',
    borderFocus: '#0A9E8A',
    error: '#B91C1C',
    warning: '#D97706',
    success: '#15803D',
    info: '#0369A1',
  },
  dark: {
    background: '#0F172A',
    backgoundSecondary: '#1E293B',
    backgroundElement: '#0D2E2A',
    backgroundSelected: '#0F3D37',
    surface:'#1E293B',
    text: '#ffffff',
    textSecondary: '#94A3B8',
    textInverse: '#0F172A',
    textMuted: '#64748B',
    primary: '#0BBD93',
    primaryDark: '#0A9E8A',
    primaryLight: '#0D2E2A',
    border: '#334155',
    borderFocus: '#0BBD9E',
    error: '#EF4444',
    warning: 'F59E0B',
    success: '22C55E',
    info: '38BDF8',
  },
} as const;

export type ColorScheme = 'light' | 'dark';
export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// Tipografía - Nunito
export const FontFamily = Platform.select({
  ios: {
    regular: 'Nunito-regular',
    medium: 'Nunito-Medium',
    semiBold: 'Nunito-SemiBold',
    bold: 'Nunito-Bold',
    extraBold: 'Nunito-ExtraBold',
    sansRegular: 'NunitoSans-Regular',
    sansSemiBold: 'NunitoSans-SemiBold',
    sansBold: 'NunitoSans-Bold',
  },
  android: {
    regular: 'Nunito-Regular',
    medium: 'Nunito-Medium',
    semiBold: 'Nunito-SemiBold',
    bold: 'Nunito-Bold',
    extraBold: 'Nunito-ExtraBold',
    sansRegular: 'NanitoSans-Regular',
    sansSemiBold: 'NunitoSans-SemiBold',
    sansBold: 'NunitoSans-Bold',
  },
  default: {
    regular: 'system-ui',
    medium: 'system-ui',
    semiBold: 'system-ui',
    bold: 'system-ui',
    extraBold: 'system-ui',
    sansRegular: 'system-ui',
    sansSemiBold: 'system-ui',
    sansBold: 'system-ui',
  },
})!;

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 34,
} as const;
// Espaciado (base 4px)
export const Spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;
// Bordes y sombras
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const

export const Shadow = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
} as const;

// Iconos - Lucide (24 x 24px, trazo de 2 px)
export const IconSize = { sm: 16, md: 20, lg: 24, xl: 32 } as const;
export const IconStroke = 2;

// Layout
export const Layout = {
  MaxContentWidth: 420,
  headerHeight: 56,
  tabBarHeight: 64,
} as const;

export type ThemeName = 'pink' | 'blue';

export type AppTheme = {
  name: ThemeName;
  // Degradado del botón principal y elementos de acento del tema
  gradientColors: readonly [string, string];
  accent: string;
  accentLight: string;
  // Fondo de pantalla y fonde de la ilustración
  background: string;
  illustrationBg: string;
  // Fase principal en la pantalla de inicio
  headline: string;
  // imagen de ilustración (Mujer para pink y hombre para blue)
  illustration: 'mujer' | 'hombre';
};

export const themes: Record<ThemeName, AppTheme> = {
  pink: {
    name: 'pink',
    gradientColors: ['#F472B6', '#EC4899'],
    accent: '#EC4899',
    accentLight: '#FDF2F8',
    background: 'FDFCFF',
    illustrationBg: '#FBCFE8',
    headline: 'Tu bien estar \ nos inspira',
    illustration: 'mujer',
  },
  blue: {
    name: 'blue',
    gradientColors: ['#60A5FA', '#2563EB'],
    accent: '#2563EB',
    accentLight: '#EFF6FF',
    background: '#FAFCFF',
    illustrationBg: '#BFDBFE',
    headline: 'Tu bienestar \ nos impulsa',
    illustration: 'hombre',
  },
};
