import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, FileText, ShieldCheck, CalendarDays } from 'lucide-react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { FontSize, Spacing, Layout } from '../../constants/theme';
import type { LegalDocument, LegalBlock } from '../../content/legal/types';

function Block({ block, accent }: { block: LegalBlock; accent: string }) {
  switch (block.type) {
    case 'p':
      return <Text style={styles.p}>{block.text}</Text>;
    case 'bullets':
      return (
        <View style={styles.list}>
          {block.items.map((item, index) => (
            <View key={index} style={styles.bulletRow}>
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
              {row.fields.map((field) => (
                <Text key={field.label} style={styles.rowField}>
                  <Text style={styles.rowLabel}>{field.label}: </Text>
                  {field.value}
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
  const isPrivacy = /privacidad/i.test(doc.title);
  const accent = theme.accent;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: '#E2E8F0' }]}>
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          hitSlop={12}
          style={styles.back}
          accessibilityRole="button"
          accessibilityLabel="Volver"
        >
          <ChevronLeft size={24} color={accent} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Información legal</Text>
        <View style={styles.back} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.document}>
          <View style={[styles.documentTopLine, { backgroundColor: accent }]} />
          <View style={styles.documentHeader}>
            <View style={[styles.documentIcon, { backgroundColor: theme.accentLight }]}>
              {isPrivacy
                ? <ShieldCheck size={24} color={accent} strokeWidth={1.8} />
                : <FileText size={24} color={accent} strokeWidth={1.8} />}
            </View>
            <Text style={styles.eyebrow}>YO TE CUIDO · DOCUMENTACIÓN OFICIAL</Text>
            <Text style={styles.documentTitle}>{doc.title}</Text>
            <Text style={styles.intro}>
              {isPrivacy
                ? 'Conoce cómo se recopila, utiliza y protege tu información personal y de salud.'
                : 'Lee las condiciones que regulan el uso de la aplicación Yo te cuido.'}
            </Text>
            <View style={styles.metaRow}>
              <CalendarDays size={14} color="#64748B" />
              <Text style={styles.metaText}>
                {doc.effectiveDate ? `Vigente desde el ${doc.effectiveDate}` : 'Fecha de vigencia pendiente de aprobación'}
              </Text>
            </View>
          </View>

          <View style={styles.documentBody}>
            {doc.sections.map((section, index) => (
              <View key={section.title} style={styles.section}>
                <View style={[styles.sectionMarker, { backgroundColor: accent }]} />
                <View style={styles.sectionContent}>
                  <Text style={styles.sectionNumber}>
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                  <Text style={styles.sectionTitle}>{section.title.replace(/^\d+\.\s*/, '')}</Text>
                  {section.blocks.map((block, blockIndex) => (
                    <Block key={blockIndex} block={block} accent={accent} />
                  ))}
                </View>
              </View>
            ))}
          </View>

          <View style={styles.documentFooter}>
            <View style={[styles.footerRule, { backgroundColor: accent }]} />
            <Text style={styles.footerTitle}>Yo te cuido</Text>
            <Text style={styles.footerText}>Astra Insurance Agency LLC</Text>
            <Text style={styles.footerText}>Para consultas, utiliza los datos de contacto incluidos en este documento.</Text>
          </View>
        </View>
        <Text style={styles.endNote}>FIN DEL DOCUMENTO · {doc.title.toLocaleUpperCase()}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    height: Layout.headerHeight,
    borderBottomWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  back: { width: 36, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FontSize.md, fontWeight: '700', color: '#0F172A' },
  container: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[8],
    alignItems: 'center',
  },
  document: {
    width: '100%',
    maxWidth: 660,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5EAF0',
    shadowColor: '#102A43',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 2,
  },
  documentTopLine: { height: 4, width: '100%' },
  documentHeader: {
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#E9EEF3',
    alignItems: 'flex-start',
  },
  documentIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  eyebrow: {
    color: '#64748B',
    fontSize: 10,
    letterSpacing: 1.1,
    fontWeight: '800',
    marginBottom: 8,
  },
  documentTitle: {
    fontSize: 27,
    lineHeight: 34,
    color: '#102A43',
    fontWeight: '800',
    marginBottom: 8,
  },
  intro: { color: '#526579', fontSize: 14, lineHeight: 22, marginBottom: 16 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  metaText: { color: '#64748B', fontSize: 11, lineHeight: 16 },
  documentBody: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 4 },
  section: { flexDirection: 'row', alignItems: 'stretch', marginBottom: 25 },
  sectionMarker: { width: 3, borderRadius: 2, marginRight: 14, opacity: 0.8 },
  sectionContent: { flex: 1 },
  sectionNumber: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  sectionTitle: {
    color: '#102A43',
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '800',
    marginBottom: 11,
  },
  p: { fontSize: 14, color: '#334155', lineHeight: 22, marginBottom: 12 },
  list: { gap: 11, marginBottom: 13 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bullet: { width: 6, height: 6, borderRadius: 3, marginTop: 8 },
  bulletText: { flex: 1, fontSize: 14, color: '#334155', lineHeight: 22 },
  rowCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5EAF0',
    borderRadius: 9,
    padding: 14,
    gap: 7,
  },
  rowTitle: { fontSize: 14, fontWeight: '800', color: '#102A43', marginBottom: 2 },
  rowField: { fontSize: 13, color: '#475569', lineHeight: 20 },
  rowLabel: { fontWeight: '700', color: '#334155' },
  documentFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E9EEF3',
    paddingHorizontal: 24,
    paddingVertical: 22,
    backgroundColor: '#FBFCFD',
  },
  footerRule: { width: 30, height: 3, borderRadius: 2, marginBottom: 12 },
  footerTitle: { fontSize: 14, fontWeight: '800', color: '#102A43', marginBottom: 3 },
  footerText: { fontSize: 11, lineHeight: 17, color: '#64748B' },
  endNote: {
    maxWidth: 660,
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 9,
    letterSpacing: 1,
    marginTop: 15,
  },
});