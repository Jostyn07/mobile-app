import { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Search, PencilLine } from 'lucide-react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { BorderRadius, FontSize, Spacing } from '../../constants/theme';
import { useScrollIntoView, type ViewRef } from './ScrollIntoView';

type Props<T> = {
  placeholder: string;
  search: (q: string) => Promise<T[]>;
  getLabel: (item: T) => string;
  onSelect: (item: T) => void;
  onFreeText: (text: string) => void;
  minChars?: number; // 0 = muestra opciones aunque no se haya escrito nada
};

const DEBOUNCE_MS = 300;

export default function CatalogSearch<T>({
  placeholder,
  search,
  getLabel,
  onSelect,
  onFreeText,
  minChars = 2,
}: Props<T>) {
  const { theme } = useAppTheme();
  const [text, setText] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const requestId = useRef(0);
  const wrapRef = useRef<ViewRef>(null);
  const scrollIntoView = useScrollIntoView();

  useEffect(() => {
    const q = text.trim();
    if (q.length < minChars) {
      setResults([]);
      setFailed(false);
      if (minChars > 0) return;
    }
    const id = ++requestId.current;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const list = await search(q);
        if (id === requestId.current) {
          setResults(list);
          setFailed(false);
        }
      } catch (err: any) {
        if (__DEV__) console.warn('[Catálogo] error:', err?.code ?? err?.message ?? err);
        if (id === requestId.current) {
          setResults([]);
          setFailed(true);
        }
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [text]);

  const trimmed = text.trim();

  return (
    <View ref={wrapRef} collapsable={false}>
      <View style={styles.inputRow}>
        <Search size={18} color="#94A3B8" strokeWidth={2} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={text}
          onChangeText={setText}
          autoCorrect={false}
          autoCapitalize="none"
          autoFocus
          onFocus={() => scrollIntoView(wrapRef)}
        />
        {loading && <ActivityIndicator size="small" color={theme.accent} />}
      </View>

      {results.length > 0 && (
        <View style={styles.list}>
          {results.map((item, i) => (
            <TouchableOpacity
              key={`${getLabel(item)}-${i}`}
              onPress={() => onSelect(item)}
              style={[styles.option, i > 0 && styles.optionBorder]}
            >
              <Text style={styles.optionText}>{getLabel(item)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {failed && <Text style={styles.notice}>No pudimos cargar las sugerencias.</Text>}

      {trimmed.length >= 2 && (
        <TouchableOpacity
          onPress={() => onFreeText(trimmed)}
          style={[styles.freeText, { borderColor: theme.accent }]}
        >
          <PencilLine size={16} color={theme.accent} strokeWidth={2} />
          <Text style={[styles.freeTextLabel, { color: theme.accent }]} numberOfLines={1}>
            Usar «{trimmed}»
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing[3],
    height: 44,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: '#0F172A',
  },
  list: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.sm,
    marginTop: Spacing[2],
    backgroundColor: '#fff',
  },
  option: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[3],
  },
  optionBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  optionText: {
    fontSize: FontSize.md,
    color: '#0F172A',
  },
  notice: {
    fontSize: FontSize.sm,
    color: '#B91C1C',
    marginTop: Spacing[2],
  },
  freeText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing[3],
    height: 44,
    marginTop: Spacing[2],
  },
  freeTextLabel: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
});