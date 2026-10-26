import { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Plus, Pencil, Trash2 } from 'lucide-react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import type { Medication } from '../../config/onboardingStore';
import { searchMedications, type MedicationOption } from '../../services/catalogs';
import CheckRow from '../form/CheckRow';
import CatalogSearch from '../form/CatalogSearch';
import Chips from './Chips';
import { formStyles as s } from './formStyles';
import { useScrollIntoView, type ViewRef } from '../form/ScrollIntoView';

type Props = {
  medications: Medication[];
  noMedications: boolean;
  onChange: (medications: Medication[], noMedications: boolean) => void;
};

type Draft = Omit<Medication, 'id'>;
type Mode = { kind: 'list' } | { kind: 'search' } | { kind: 'details'; editingId: string | null };

const STATUS_OPTIONS = [
  { value: 'current' as const, label: 'Lo tomo actualmente' },
  { value: 'past' as const, label: 'Lo tomé antes' },
];

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function emptyDraft(name: string): Draft {
  return {
    name,
    rxcui: null,
    strength: '',
    source: 'manual',
    dose: '',
    frequency: '',
    reason: '',
    status: 'current',
  };
}

export default function MedicationsSection({ medications, noMedications, onChange }: Props) {
  const { theme } = useAppTheme();
  const [mode, setMode] = useState<Mode>({ kind: 'list' });
  const [draft, setDraft] = useState<Draft | null>(null);
  const [strengthOptions, setStrengthOptions] = useState<MedicationOption['strengths']>([]);
  const detailsRef = useRef<ViewRef>(null);
  const scrollIntoView = useScrollIntoView();
  const focusDetails = () => scrollIntoView(detailsRef);

  function close() {
    setMode({ kind: 'list' });
    setDraft(null);
    setStrengthOptions([]);
  }

  function pickFromCatalog(option: MedicationOption) {
    setDraft({ ...emptyDraft(option.name), rxcui: option.rxcui, source: 'rxnorm' });
    setStrengthOptions(option.strengths);
    setMode({ kind: 'details', editingId: null });
  }

  function pickFreeText(text: string) {
    setDraft(emptyDraft(text));
    setStrengthOptions([]);
    setMode({ kind: 'details', editingId: null });
  }

  function startEdit(m: Medication) {
    const { id, ...rest } = m;
    setDraft(rest);
    setStrengthOptions([]);
    setMode({ kind: 'details', editingId: id });
  }

  function chooseStrength(label: string) {
    const opt = strengthOptions.find((o) => o.label === label);
    setDraft((d) => (d ? { ...d, strength: label, rxcui: opt?.rxcui ?? d.rxcui } : d));
  }

  function save() {
    if (!draft || mode.kind !== 'details') return;
    const clean: Draft = {
      ...draft,
      strength: draft.strength.trim(),
      dose: draft.dose.trim(),
      frequency: draft.frequency.trim(),
      reason: draft.reason.trim(),
    };
    const next = mode.editingId
      ? medications.map((m) => (m.id === mode.editingId ? { ...m, ...clean } : m))
      : [...medications, { id: newId(), ...clean }];
    onChange(next, false);
    close();
  }

  const set = (key: 'strength' | 'dose' | 'frequency' | 'reason') => (t: string) =>
    setDraft((d) => (d ? { ...d, [key]: t } : d));

  return (
    <View>
      {mode.kind === 'list' &&
        medications.map((m) => (
          <View key={m.id} style={s.item}>
            <View style={s.itemText}>
              <Text style={s.itemName}>{m.name}</Text>
              {(m.strength || m.dose || m.frequency) ? (
                <Text style={s.itemDetail}>
                  {[m.strength, m.dose, m.frequency].filter(Boolean).join(' · ')}
                </Text>
              ) : null}
              <Text style={s.itemDetail}>
                {[m.status === 'past' ? 'Lo tomó antes' : null, m.reason || null]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
            </View>
            <TouchableOpacity onPress={() => startEdit(m)} hitSlop={8} style={s.iconBtn}>
              <Pencil size={18} color="#334155" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onChange(medications.filter((x) => x.id !== m.id), noMedications)}
              hitSlop={8}
              style={s.iconBtn}
            >
              <Trash2 size={18} color={theme.accent} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        ))}

      {mode.kind === 'search' && (
        <View style={[s.form, { borderColor: theme.accent }]}>
          <CatalogSearch<MedicationOption>
            placeholder="Nombre del medicamento"
            search={searchMedications}
            getLabel={(o) => o.name}
            onSelect={pickFromCatalog}
            onFreeText={pickFreeText}
          />
          <View style={s.actions}>
            <TouchableOpacity onPress={close} style={s.secondaryBtn}>
              <Text style={s.secondaryText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {mode.kind === 'details' && draft && (
        <View ref={detailsRef} collapsable={false} style={[s.form, { borderColor: theme.accent }]}>
          <Text style={s.selectedName}>{draft.name}</Text>

          <Text style={s.label}>Concentración</Text>
          {strengthOptions.length > 0 ? (
            <Chips
              options={strengthOptions.map((o) => ({ value: o.label, label: o.label }))}
              selected={draft.strength ? [draft.strength] : []}
              onToggle={chooseStrength}
            />
          ) : (
            <TextInput
              style={s.input}
              placeholder="Ej. 500 mg tableta"
              placeholderTextColor="#94A3B8"
              value={draft.strength}
              onChangeText={set('strength')}
              onFocus={focusDetails}
            />
          )}

          <View style={s.row}>
            <View style={s.half}>
              <Text style={s.label}>Cantidad</Text>
              <TextInput
                style={s.input}
                placeholder="Ej. 1 tableta"
                placeholderTextColor="#94A3B8"
                value={draft.dose}
                onChangeText={set('dose')}
                onFocus={focusDetails}
              />
            </View>
            <View style={s.half}>
              <Text style={s.label}>Frecuencia</Text>
              <TextInput
                style={s.input}
                placeholder="Ej. 2 veces al día"
                placeholderTextColor="#94A3B8"
                value={draft.frequency}
                onChangeText={set('frequency')}
                onFocus={focusDetails}
              />
            </View>
          </View>

          <Text style={s.label}>¿Para qué lo tomas?</Text>
          <TextInput
            style={s.input}
            placeholder="Ej. Diabetes"
            placeholderTextColor="#94A3B8"
            value={draft.reason}
            onChangeText={set('reason')}
            onFocus={focusDetails}
          />

          <Chips
            options={STATUS_OPTIONS}
            selected={[draft.status]}
            onToggle={(v) => setDraft((d) => (d ? { ...d, status: v } : d))}
          />

          <View style={s.actions}>
            <TouchableOpacity onPress={close} style={s.secondaryBtn}>
              <Text style={s.secondaryText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={save} style={[s.primaryBtn, { backgroundColor: theme.accent }]}>
              <Text style={s.primaryText}>{mode.editingId ? 'Guardar' : 'Agregar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {mode.kind === 'list' && !noMedications && (
        <TouchableOpacity
          onPress={() => setMode({ kind: 'search' })}
          style={[s.addBtn, { borderColor: theme.accent }]}
        >
          <Plus size={18} color={theme.accent} strokeWidth={2} />
          <Text style={[s.addText, { color: theme.accent }]}>Agregar medicamento</Text>
        </TouchableOpacity>
      )}

      {mode.kind === 'list' && medications.length === 0 && (
        <CheckRow
          label="No tomo medicamentos"
          checked={noMedications}
          onPress={() => onChange([], !noMedications)}
        />
      )}
    </View>
  );
}