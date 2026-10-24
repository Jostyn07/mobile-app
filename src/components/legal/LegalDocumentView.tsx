import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { BorderRadius, FontSize, Spacing, Layout } from '../../constants/theme';
import type { LegalDocument, LegalBlock } from '../../content/legal/types';

function Block({ block, accent }: { block: LegalBlock; accent: string }) {
  switch (block.type) {
    case 'p':
      return <Text style={styles.p}>{block.text}</Text>;
    case 'bullets':
      return (
        <View style={styles.list}>
          {block.items.map((item) => (
            <View key={item} style={styles.bulletRow}>
              <View style={[styles.bullet, { backgroundColor: accent }]} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      );
    case 'rows':
      return (
        <View style={styles.list}>
          {block.rows.map((row) => (
            <View key={row.title} style={styles.rowCard}>
              <Text style={styles.rowTitle}>{row.title}</Text>
              {row.fields.map((f) => (
                <Text key={f.label} style={styles.rowField}>
                  <Text style={styles.rowLabel}>{f.label}: </Text>
                  {f.value}
                </Text>
              ))}
            </View>
          ))}
        </View>
      );
  }
}

export default function LegalDocumentView({ doc }: { doc: LegalDocument }) {
  const { theme } = useAppTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          hitSlop={12}
          style={styles.back}
        >
          <ChevronLeft size={24} color={theme.accent} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{doc.title}</Text>
        <View style={styles.back} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          {doc.effectiveDate ? (
            <Text style={styles.effective}>Vigente desde: {doc.effectiveDate}</Text>
          ) : null}

          {doc.sections.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.accent }]}>{section.title}</Text>
              {section.blocks.map((block, i) => (
                <Block key={i} block={block} accent={theme.accent} />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    height: Layout.headerHeight,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  back: {
    width: 32,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: '#0F172A',
  },
  container: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[10],
  },
  content: {
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignSelf: 'center',
  },
  effective: {
    fontSize: FontSize.sm,
    color: '#64748B',
    marginBottom: Spacing[4],
  },
  section: {
    marginBottom: Spacing[6],
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing[3],
  },
  p: {
    fontSize: FontSize.md,
    color: '#334155',
    lineHeight: FontSize.md * 1.55,
    marginBottom: Spacing[3],
  },
  list: {
    gap: Spacing[2],
    marginBottom: Spacing[3],
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[2],
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 9,
  },
  bulletText: {
    flex: 1,
    fontSize: FontSize.md,
    color: '#334155',
    lineHeight: FontSize.md * 1.55,
  },
  rowCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.md,
    padding: Spacing[3],
    gap: Spacing[1],
  },
  rowTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: '#0F172A',
  },
  rowField: {
    fontSize: FontSize.md,
    color: '#334155',
    lineHeight: FontSize.md * 1.5,
  },
  rowLabel: {
    fontWeight: '600',
    color: '#0F172A',
  },
});