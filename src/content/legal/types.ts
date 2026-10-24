export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'rows'; rows: { title: string; fields: { label: string; value: string }[] }[] };

export type LegalSection = {
  title: string;
  blocks: LegalBlock[];
};

export type LegalDocument = {
  title: string;
  effectiveDate: string; // vacío hasta que el abogado apruebe el texto
  sections: LegalSection[];
};