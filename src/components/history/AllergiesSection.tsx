import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Plus, Trash2 } from 'lucide-react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import type {
  Allergy,
  AllergyCategory,
  AllergyReaction,
  AllergyStatus,
} from '../../config/onboardingStore';
import { searchAllergens, type AllergenOption } from '../../services/catalogs';
import CheckRow from '../form/CheckRow';
import CatalogSearch from '../form/CatalogSearch';
import Chips from './Chips';
import { formStyles as s } from './formStyles';

export const ALLERGY_CATEGORIES: { value: AllergyCategory; label: string }[] = [
  { value: 'medication', label: 'Medicamento' },
  { value: 'food', label: 'Alimento' },
  { value: 'environment', label: 'Ambiental u otra' },
];

export const REACTIONS: { value: AllergyReaction; label: string }[] = [
  { value: 'skin', label: 'Ronchas o picazón' },
  { value: 'swelling', label: 'Hinchazón' },
  { value: 'breathing', label: 'Dificultad para respirar' },
  { value: 'digestive', label: 'Problemas digestivos' },
  { value: 'other', label: 'Otra' },
];

const VERIFICATION = [
  { value: 'confirmed' as const, label: 'Confirmada por un médico' },
  { value: 'self_reported' as const, label: 'Declarada por mí' },
];

type Props = {
  allergies: Allergy[];
  status: AllergyStatus;
  onChange: (allergies: Allergy[], status: AllergyStatus) => void;
};

type Draft = Omit<Allergy, 'id'>;
type Step = 'list' | 'category' | 'search' | 'details';

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function AllergiesSection({ allergies, status, onChange }: Props) {
  const { theme } = useAppTheme();
  const [step, setStep] = useState<Step>('list');
  const [category, setCategory] = useState<AllergyCategory>('medication');
  const [draft, setDraft] = useState<Draft | null>(null);

  function close() {
    setStep('list');
    setDraft(null);
  }

  function chooseCategory(c: AllergyCategory) {
    setCategory(c);
    setStep('search');
  }

  function startDetails(substance: string, code: string | null, source: Draft['source']) {
    setDraft({ substance, code, source, category, reactions: [], verification: 'self_reported' });
    setStep('details');
  }

  function save() {
    if (!draft) return;
    onChange([...allergies, { id: newId(), ...draft }], 'has_allergies');
    close();
  }

  function remove(id: string) {
    const next = allergies.filter((a) => a.id !== id);
    onChange(next, next.length ? 'has_allergies' : null);
  }

  function toggleReaction(r: AllergyReaction) {
    setDraft((d) =>
      d
        ? { ...d, reactions: d.reactions.includes(r) ? d.reactions.filter((x) => x !== r) : [...d.reactions, r] }
        : d,
    );
  }

  const categoryLabel = (c: AllergyCategory) => ALLERGY_CATEGORIES.find((x) => x.value === c)?.label;

  return (
    <View>
      {step === 'list' &&
        allergies.map((a) => (
          <View key={a.id} style={s.item}>
            <View style={s.itemText}>
              <Text style={s.itemName}>{a.substance}</Text>
              <Text style={s.itemDetail}>
                {[
                  categoryLabel(a.category),
                  a.verification === 'confirmed' ? 'Confirmada por un médico' : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
              {a.reactions.length > 0 && (
                <Text style={s.itemDetail}>
                  {a.reactions.map((r) => REACTIONS.find((x) => x.value === r)?.label).join(', ')}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={() => remove(a.id)} hitSlop={8} style={s.iconBtn}>
              <Trash2 size={18} color={theme.accent} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        ))}

      {step === 'category' && (
        <View style={[s.form, { borderColor: theme.accent }]}>
          <Text style={s.label}>¿A qué tipo de sustancia?</Text>
          <Chips options={ALLERGY_CATEGORIES} selected={[]} onToggle={chooseCategory} />
          <View style={s.actions}>
            <TouchableOpacity onPress={close} style={s.secondaryBtn}>
              <Text style={s.secondaryText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step === 'search' && (
        <View style={[s.form, { borderColor: theme.accent }]}>
          <Text style={s.label}>{categoryLabel(category)}</Text>
          <CatalogSearch<AllergenOption>
            placeholder={category === 'medication' ? 'Ej. penicilina' : 'Buscar'}
            search={(q) => searchAllergens(category, q)}
            getLabel={(o) => o.name}
            onSelect={(o) => startDetails(o.name, o.code, o.system ?? 'manual')}
            onFreeText={(t) => startDetails(t, null, 'manual')}
            minChars={category === 'medication' ? 2 : 0}
          />
          <View style={s.actions}>
            <TouchableOpacity onPress={() => setStep('category')} style={s.secondaryBtn}>
              <Text style={s.secondaryText}>Atrás</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step === 'details' && draft && (
        <View style={[s.form, { borderColor: theme.accent }]}>
          <Text style={s.selectedName}>{draft.substance}</Text>

          <Text style={s.label}>¿Qué reacción tuviste?</Text>
          <Chips options={REACTIONS} selected={draft.reactions} onToggle={toggleReaction} />

          <Chips
            options={VERIFICATION}
            selected={[draft.verification]}
            onToggle={(v) => setDraft((d) => (d ? { ...d, verification: v } : d))}
          />

          <View style={s.actions}>
            <TouchableOpacity onPress={close} style={s.secondaryBtn}>
              <Text style={s.secondaryText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={save} style={[s.primaryBtn, { backgroundColor: theme.accent }]}>
              <Text style={s.primaryText}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step === 'list' && status !== 'none_known' && status !== 'unsure' && (
        <TouchableOpacity
          onPress={() => setStep('category')}
          style={[s.addBtn, { borderColor: theme.accent }]}
        >
          <Plus size={18} color={theme.accent} strokeWidth={2} />
          <Text style={[s.addText, { color: theme.accent }]}>Agregar alergia</Text>
        </TouchableOpacity>
      )}

      {step === 'list' && allergies.length === 0 && (
        <>
          <CheckRow
            label="No tengo alergias conocidas"
            checked={status === 'none_known'}
            onPress={() => onChange([], status === 'none_known' ? null : 'none_known')}
          />
          <CheckRow
            label="No estoy seguro/a"
            checked={status === 'unsure'}
            onPress={() => onChange([], status === 'unsure' ? null : 'unsure')}
          />
        </>
      )}
    </View>
  );
}