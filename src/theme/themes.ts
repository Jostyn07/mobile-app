export type ThemeName = 'pink' | 'blue';

export const themes = {
  pink: {
    name: 'pink' as const,
    gradientColors: ['#F472B6', '#EC4899'] as const,
    accent: '#EC4899',
    background: '#FDF2F8',
    illustrationBg: '#FBCFE8',
    headline: 'Tu bienestar\nnos inspira',
  },
  blue: {
    name: 'blue' as const,
    gradientColors: ['#60A5FA', '#2563EB'] as const,
    accent: '#2563EB',
    background: '#EFF6FF',
    illustrationBg: '#BFDBFE',
    headline: 'Tu bienestar\nnos impulsa',
  },
};

export type Theme = typeof themes.pink;