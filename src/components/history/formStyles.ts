import { StyleSheet } from 'react-native';
import { BorderRadius, FontSize, Spacing } from '../../constants/theme';

// Estilos compartidos por los formularios de medicamentos y alergias.
export const formStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.md,
    padding: Spacing[3],
    marginBottom: Spacing[2],
  },
  itemText: {
    flex: 1,
  },
  itemName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: '#0F172A',
  },
  itemDetail: {
    fontSize: FontSize.sm,
    color: '#64748B',
    marginTop: 2,
  },
  iconBtn: {
    padding: Spacing[2],
  },
  form: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing[3],
    gap: Spacing[3],
    marginBottom: Spacing[2],
  },
  selectedName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: '#0F172A',
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: '#334155',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing[3],
    height: 44,
    fontSize: FontSize.md,
    color: '#0F172A',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing[2],
  },
  half: {
    flex: 1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  chip: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
  },
  chipText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: '#334155',
  },
  chipTextOn: {
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing[2],
  },
  secondaryBtn: {
    paddingHorizontal: Spacing[4],
    height: 40,
    justifyContent: 'center',
  },
  secondaryText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: '#64748B',
  },
  primaryBtn: {
    paddingHorizontal: Spacing[5],
    height: 40,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
  },
  primaryText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: '#fff',
  },
  disabled: {
    opacity: 0.5,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    height: 48,
    marginBottom: Spacing[2],
  },
  addText: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});