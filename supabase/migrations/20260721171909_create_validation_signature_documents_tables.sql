/*
# Create tables for Validation, Signature, and Documentary Centers

1. New Tables
- `institutions`: educational institutions submitted for ministry validation.
  Columns: name, type, province, city, director, email, phone, address,
  status (en_attente|en_revision|approuve|rejete), student_count, formation_count,
  submitted_at, validated_at, notes.
- `formations`: study programs submitted by institutions for ministry validation.
  Columns: institution_id (FK), name, filiere, level, duration, description,
  status (en_attente|en_revision|approuve|rejete), submitted_at, validated_at, notes.
- `documents`: official documents flowing through signature + documentary centers.
  Columns: title, type, reference, institution_id (FK), formation_id (FK),
  student_name, status (brouillon|soumis|en_revision|approuve|signe|complete|rejete),
  signed, signed_at, signed_by, notes.
2. Security
- Single-tenant app (no sign-in). RLS enabled on all tables.
- Policies allow anon + authenticated full CRUD (data is intentionally shared).
3. Notes
- Status workflows mirror the ministry validation pipeline.
- formations.institution_id and documents.institution_id cascade appropriately.
*/

CREATE TABLE IF NOT EXISTS institutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'Institut',
  province text NOT NULL DEFAULT 'Bujumbura Mairie',
  city text,
  director text,
  email text,
  phone text,
  address text,
  status text NOT NULL DEFAULT 'en_attente',
  student_count integer NOT NULL DEFAULT 0,
  formation_count integer NOT NULL DEFAULT 0,
  submitted_at timestamptz DEFAULT now(),
  validated_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_institutions" ON institutions;
CREATE POLICY "anon_select_institutions" ON institutions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_institutions" ON institutions;
CREATE POLICY "anon_insert_institutions" ON institutions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_institutions" ON institutions;
CREATE POLICY "anon_update_institutions" ON institutions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_institutions" ON institutions;
CREATE POLICY "anon_delete_institutions" ON institutions FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS formations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid REFERENCES institutions(id) ON DELETE CASCADE,
  name text NOT NULL,
  filiere text NOT NULL DEFAULT 'Sciences',
  level text NOT NULL DEFAULT 'Licence',
  duration text,
  description text,
  status text NOT NULL DEFAULT 'en_attente',
  submitted_at timestamptz DEFAULT now(),
  validated_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE formations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_formations" ON formations;
CREATE POLICY "anon_select_formations" ON formations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_formations" ON formations;
CREATE POLICY "anon_insert_formations" ON formations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_formations" ON formations;
CREATE POLICY "anon_update_formations" ON formations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_formations" ON formations;
CREATE POLICY "anon_delete_formations" ON formations FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL DEFAULT 'Diplôme',
  reference text NOT NULL,
  institution_id uuid REFERENCES institutions(id) ON DELETE SET NULL,
  formation_id uuid REFERENCES formations(id) ON DELETE SET NULL,
  student_name text,
  status text NOT NULL DEFAULT 'brouillon',
  signed boolean NOT NULL DEFAULT false,
  signed_at timestamptz,
  signed_by text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_documents" ON documents;
CREATE POLICY "anon_select_documents" ON documents FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_documents" ON documents;
CREATE POLICY "anon_insert_documents" ON documents FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_documents" ON documents;
CREATE POLICY "documents_update_anon" ON documents FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "documents_update_anon" ON documents;
CREATE POLICY "anon_update_documents" ON documents FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_documents" ON documents;
CREATE POLICY "anon_delete_documents" ON documents FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_formations_institution_id ON formations(institution_id);
CREATE INDEX IF NOT EXISTS idx_documents_institution_id ON documents(institution_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_institutions_status ON institutions(status);
