import { TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Spacing } from '../../constants/theme';

type Props = {
  onPress?: () => void;
};

export default function BackButton({ onPress }: Props) {
  function handlePress() {
    if (onPress) return onPress();
    if (router.canGoBack()) router.back();
    else router.replace('/login');
  }

  return (
    <TouchableOpacity onPress={handlePress} hitSlop={12} style={styles.btn}>
      <ArrowLeft size={24} color="#334155" strokeWidth={2} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignSelf: 'flex-start',
    marginBottom: Spacing[4],
  },
});