import { View, Text, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { formStyles as s } from './formStyles';

type Props<T extends string> = {
  options: { value: T; label: string }[];
  selected: T[];
  onToggle: (value: T) => void;
};

export default function Chips<T extends string>({ options, selected, onToggle }: Props<T>) {
  const { theme } = useAppTheme();
  return (
    <View style={s.chips}>
      {options.map((o) => {
        const on = selected.includes(o.value);
        return (
          <TouchableOpacity
            key={o.value}
            onPress={() => onToggle(o.value)}
            style={[s.chip, on && { backgroundColor: theme.accent, borderColor: theme.accent }]}
          >
            <Text style={[s.chipText, on && s.chipTextOn]}>{o.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}