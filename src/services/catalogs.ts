import { apiGet } from '../config/api';

export type MedicationOption = {
  name: string;
  rxcui: string | null;
  strengths: { label: string; rxcui: string | null }[];
};

export type AllergenCategory = 'medication' | 'food' | 'environment';

export type AllergenOption = {
  name: string;
  code: string | null;
  system: 'rxnorm' | 'unii' | null;
};

export async function searchMedications(q: string): Promise<MedicationOption[]> {
  const { results } = await apiGet<{ results: MedicationOption[] }>('/catalog/medications', { q });
  return results;
}

export async function searchAllergens(category: AllergenCategory, q: string): Promise<AllergenOption[]> {
  const { results } = await apiGet<{ results: AllergenOption[] }>('/catalog/allergens', { category, q });
  return results;
}