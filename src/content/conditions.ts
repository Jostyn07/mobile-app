import {
  Droplet,
  HeartPulse,
  TestTube,
  Shield,
  Wind,
  Bone,
  Heart,
  Bean,
  Scale,
  Plus,
  type LucideIcon,
} from 'lucide-react-native';

export type ConditionId =
  | 'diabetes'
  | 'hypertension'
  | 'cholesterol'
  | 'thyroid'
  | 'asthma'
  | 'arthritis'
  | 'heart'
  | 'kidney'
  | 'weight'
  | 'other';

export type Condition = {
  id: ConditionId;
  name: string;
  detail: string;
  icon: LucideIcon;
};

export const CONDITIONS: Condition[] = [
  { id: 'diabetes', name: 'Diabetes', detail: 'Tipo 1 o tipo 2', icon: Droplet },
  { id: 'hypertension', name: 'Presión arterial alta', detail: 'Hipertensión', icon: HeartPulse },
  { id: 'cholesterol', name: 'Colesterol alto', detail: 'Colesterol elevado', icon: TestTube },
  { id: 'thyroid', name: 'Problemas de tiroides', detail: 'Hipotiroidismo o hipertiroidismo', icon: Shield },
  { id: 'asthma', name: 'Asma', detail: 'Seguimiento respiratorio', icon: Wind },
  { id: 'arthritis', name: 'Artritis o problemas articulares', detail: 'Dolor, rigidez o movilidad', icon: Bone },
  { id: 'heart', name: 'Enfermedad cardiaca', detail: 'Corazón y circulación', icon: Heart },
  { id: 'kidney', name: 'Enfermedad renal', detail: 'Riñones', icon: Bean },
  { id: 'weight', name: 'Sobrepeso u obesidad', detail: 'Control de peso', icon: Scale },
  { id: 'other', name: 'Otra condición', detail: 'No está en la lista', icon: Plus },
];

// Antecedentes familiares (padres, hermanos o abuelos).
export const FAMILY_CONDITIONS = [
  'Diabetes',
  'Presión arterial alta',
  'Colesterol alto',
  'Enfermedad cardiaca',
  'Derrame cerebral',
  'Enfermedad renal',
  'Cáncer',
] as const;