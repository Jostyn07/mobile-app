import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, Circle } from 'lucide-react-native';
import { FontSize, Spacing } from '../constants/theme';

type Props = {
  password: string;
  accentColor: string;
};

const requirements = [
  { label: 'Mínimo 8 caracteres', test: (p: string) => p.length >= 8 },
  { label: 'Una letra mayúscula', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Una letra minúscula', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Un número', test: (p: string) => /[0-9]/.test(p) },
  { label: 'Un símbolo (ej. !@#$%)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export function isPasswordValid(password: string): boolean {
  return requirements.every((r) => r.test(password));
}

export default function PasswordRequirements({ password, accentColor }: Props) {
  return (
    <View style={styles.container}>
      {requirements.map((req) => {
        const met = req.test(password);
        const Icon = met ? CheckCircle2 : Circle;
        return (
          <View key={req.label} style={styles.row}>
            <Icon size={14} color={met ? accentColor : '#CBD5E1'} strokeWidth={2} />
            <Text style={[styles.label, met && { color: accentColor, fontWeight: '600' }]}>
              {req.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Spacing[4],
    gap: Spacing[1],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: FontSize.sm,
    color: '#94A3B8',
  },
});