import { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Eye, EyeOff, type LucideIcon } from 'lucide-react-native';
import { BorderRadius, FontSize, Spacing, Shadow } from '../../constants/theme';

type Props = TextInputProps & {
  icon: LucideIcon;
  secure?: boolean;
};

export default function AuthInput({ icon: Icon, secure, style, ...rest }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={[styles.row, Shadow.sm]}>
      <Icon size={18} color="#94A3B8" strokeWidth={2} style={styles.icon} />
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#94A3B8"
        secureTextEntry={secure && !visible}
        autoCorrect={false}
        {...rest}
      />
      {secure && (
        <TouchableOpacity onPress={() => setVisible((v) => !v)} hitSlop={8}>
          {visible
            ? <EyeOff size={18} color="#94A3B8" strokeWidth={2} />
            : <Eye size={18} color="#94A3B8" strokeWidth={2} />}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing[4],
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: Spacing[3],
    height: 52,
    width: '100%',
  },
  icon: {
    marginRight: Spacing[2],
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: '#0F172A',
  },
});