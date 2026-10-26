import { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { BorderRadius, FontSize, Spacing, Shadow } from '../../constants/theme';

type Props = {
  icon: LucideIcon;
  title: string;
  summary?: string; // lo que el usuario ya respondió, ej. "2 seleccionadas"
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export default function Accordion({ icon: Icon, title, summary, open, onToggle, children }: Props) {
  const { theme } = useAppTheme();
  const Chevron = open ? ChevronUp : ChevronDown;

  return (
    <View
      style={[
        styles.card,
        Shadow.sm,
        { borderColor: open ? theme.accent : '#E2E8F0' },
      ]}
    >
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.8}
        style={styles.header}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <View style={[styles.iconBox, { backgroundColor: theme.accentLight }]}>
          <Icon size={20} color={theme.accent} strokeWidth={2} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          {summary ? (
            <Text style={[styles.summary, { color: theme.accent }]} numberOfLines={1}>
              {summary}
            </Text>
          ) : null}
        </View>
        <Chevron size={20} color="#64748B" strokeWidth={2} />
      </TouchableOpacity>

      {open && <View style={styles.body}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing[3],
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    padding: Spacing[4],
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: '#0F172A',
  },
  summary: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginTop: 2,
  },
  body: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: Spacing[3],
  },
});