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
  admin_name: string | null;
  admin_email: string | null;
  last_sync_at: string | null;
  sync_percentage: number;
  accreditation_count: number;
  course_count: number;
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
  student_id: string | null;
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

export interface Student {
  id: string;
  institution_id: string;
  nse: string;
  first_name: string;
  last_name: string;
  gender: string;
  birth_date: string | null;
  promotion: string | null;
  faculty: string | null;
  department: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  institutions?: Institution;
}

export interface Program {
  id: string;
  institution_id: string;
  name: string;
  code: string | null;
  faculty: string | null;
  level: string;
  duration: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  institution_id: string;
  program_id: string | null;
  name: string;
  code: string | null;
  credits: number;
  semester: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Accreditation {
  id: string;
  institution_id: string;
  reference: string;
  authority: string | null;
  granted_at: string | null;
  expires_at: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: string;
  institution_id: string;
  student_id: string | null;
  title: string;
  reference: string;
  issued_at: string;
  status: string;
  signed: boolean;
  signed_by: string | null;
  signed_at: string | null;
  created_at: string;
  updated_at: string;
  institutions?: Institution;
}

export interface SyncHistoryItem {
  id: string;
  institution_id: string;
  resource: string;
  status: string;
  items_count: number;
  message: string | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export interface ValidationLot {
  id: string;
  institution_id: string;
  reference: string;
  type: string;
  item_count: number;
  status: string;
  submitted_at: string;
  validated_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
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
  actif: 'Actif',
  inactif: 'Inactif',
  'émis': 'Émis',
  succès: 'Succès',
  échec: 'Échec',
  validé: 'Validé',
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
  actif: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  inactif: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  'émis': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  succès: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  échec: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  validé: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

export const SYNC_RESOURCES = [
  'étudiants', 'formations', 'cours', 'documents', 'diplômes', 'certificats', 'examens', 'accréditations',
] as const;

export type SyncResource = typeof SYNC_RESOURCES[number];

export const SYNC_RESOURCE_LABELS: Record<string, string> = {
  'étudiants': 'Étudiants',
  'formations': 'Formations',
  'cours': 'Cours',
  'documents': 'Documents',
  'diplômes': 'Diplômes',
  'certificats': 'Certificats',
  'examens': 'Examens',
  'accréditations': 'Accréditations',
};
