import { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet, Pressable } from 'react-native';
import { CalendarDays, ChevronDown, X } from 'lucide-react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { BorderRadius, FontSize, Spacing, Shadow } from '../../constants/theme';
import type { MonthYear } from '../../config/onboardingStore';

export const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export function formatMonthYear(v: MonthYear): string {
  return `${MONTHS[v.month - 1]} ${v.year}`;
}

type Props = {
  value: MonthYear | null;
  onChange: (value: MonthYear) => void;
  placeholder?: string;
  disabled?: boolean;
  yearsBack?: number;
};

export default function MonthYearPicker({
  value,
  onChange,
  placeholder = 'Selecciona la fecha',
  disabled,
  yearsBack = 80,
}: Props) {
  const { theme } = useAppTheme();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(value?.year ?? currentYear);

  const years = Array.from({ length: yearsBack + 1 }, (_, i) => currentYear - i);

  function openPicker() {
    setYear(value?.year ?? currentYear);
    setOpen(true);
  }

  function pickMonth(month: number) {
    onChange({ year, month });
    setOpen(false);
  }

  return (
    <>
      <TouchableOpacity
        onPress={openPicker}
        disabled={disabled}
        activeOpacity={0.8}
        style={[styles.field, Shadow.sm, disabled && styles.disabled]}
      >
        <CalendarDays size={18} color={theme.accent} strokeWidth={2} />
        <Text style={[styles.fieldText, !value && styles.placeholder]}>
          {value ? formatMonthYear(value) : placeholder}
        </Text>
        <ChevronDown size={18} color="#94A3B8" strokeWidth={2} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Mes y año</Text>
            <TouchableOpacity onPress={() => setOpen(false)} hitSlop={12}>
              <X size={22} color="#334155" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.years}>
            {years.map((y) => {
              const on = y === year;
              return (
                <TouchableOpacity
                  key={y}
                  onPress={() => setYear(y)}
                  style={[
                    styles.yearChip,
                    on ? { backgroundColor: theme.accent, borderColor: theme.accent } : null,
                  ]}
                >
                  <Text style={[styles.yearText, on && styles.yearTextOn]}>{y}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.months}>
            {MONTHS.map((m, i) => {
              const month = i + 1;
              const future = year === currentYear && month > currentMonth;
              const on = value?.year === year && value.month === month;
              return (
                <TouchableOpacity
                  key={m}
                  disabled={future}
                  onPress={() => pickMonth(month)}
                  style={[
                    styles.monthCell,
                    on && { backgroundColor: theme.accentLight, borderColor: theme.accent },
                    future && styles.disabled,
                  ]}
                >
                  <Text style={[styles.monthText, on && { color: theme.accent, fontWeight: '700' }]}>
                    {m.slice(0, 3)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing[4],
    height: 52,
  },
  fieldText: {
    flex: 1,
    fontSize: FontSize.md,
    color: '#0F172A',
  },
  placeholder: {
    color: '#94A3B8',
  },
  disabled: {
    opacity: 0.4,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[8],
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  sheetTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: '#0F172A',
  },
  years: {
    gap: Spacing[2],
    paddingBottom: Spacing[4],
  },
  yearChip: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  yearText: {
    fontSize: FontSize.md,
    color: '#334155',
    fontWeight: '600',
  },
  yearTextOn: {
    color: '#fff',
  },
  months: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  monthCell: {
    width: '31%',
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: FontSize.md,
    color: '#334155',
  },
});