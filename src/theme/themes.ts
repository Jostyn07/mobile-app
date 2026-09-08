export type ThemeName = 'pink' | 'blue';

// Definimos la forma general primero (con "name" como ThemeName, no como
// un literal fijo). Así ambos temas encajan en el mismo tipo sin conflicto.
export type Theme = {
  name: ThemeName;
  gradientColors: readonly [string, string];
  accent: string;
  background: string;
  illustrationBg: string;
  headline: string;
};

export const themes: Record<ThemeName, Theme> = {
  pink: {
    name: 'pink',
    gradientColors: ['#F472B6', '#EC4899'],
    accent: '#EC4899',
    background: '#FDF2F8',
    illustrationBg: '#FBCFE8',
    headline: 'Tu bienestar\nnos inspira',
  },
  blue: {
    name: 'blue',
    gradientColors: ['#60A5FA', '#2563EB'],
    accent: '#2563EB',
    background: '#EFF6FF',
    illustrationBg: '#BFDBFE',
    headline: 'Tu bienestar\nnos impulsa',
  },
};