export type InstitutionStatus = 'en_attente' | 'en_revision' | 'approuve' | 'rejete';
export type FormationStatus = 'en_attente' | 'en_revision' | 'approuve' | 'rejete';
export type DocumentStatus = 'brouillon' | 'soumis' | 'en_revision' | 'approuve' | 'signe' | 'complete' | 'rejete';

export interface Institution {
  id: string;
  name: string;
  type: string;
  province: string;
  city: string | null;
  director: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  status: InstitutionStatus;
  student_count: number;
  formation_count: number;
  submitted_at: string;
  validated_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Formation {
  id: string;
  institution_id: string | null;
  name: string;
  filiere: string;
  level: string;
  duration: string | null;
  description: string | null;
  status: FormationStatus;
  submitted_at: string;
  validated_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  institutions?: Institution;
}

export interface DocumentItem {
  id: string;
  title: string;
  type: string;
  reference: string;
  institution_id: string | null;
  formation_id: string | null;
  student_name: string | null;
  status: DocumentStatus;
  signed: boolean;
  signed_at: string | null;
  signed_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  institutions?: Institution;
  formations?: Formation;
}

export const STATUS_LABELS: Record<string, string> = {
  en_attente: 'En attente',
  en_revision: 'En révision',
  approuve: 'Approuvé',
  rejete: 'Rejeté',
  brouillon: 'Brouillon',
  soumis: 'Soumis',
  signe: 'Signé',
  complete: 'Complété',
};

export const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  en_attente: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  en_revision: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  approuve: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  rejete: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  brouillon: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  soumis: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  signe: { bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-500' },
  complete: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};
