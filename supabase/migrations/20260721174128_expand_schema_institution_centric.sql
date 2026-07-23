/*
# Expand NOVARIS schema for institution-centric architecture

1. New Tables
- `students`: students belonging to institutions. NSE = national student id.
  Columns: institution_id (FK), nse, first_name, last_name, gender, birth_date,
  promotion, faculty, department, email, phone, status.
- `programs`: academic programs offered by an institution.
  Columns: institution_id (FK), name, code, faculty, level, duration, status.
- `courses`: individual courses within programs.
  Columns: institution_id (FK), program_id (FK), name, code, credits, semester, status.
- `accreditations`: accreditation records for an institution.
  Columns: institution_id (FK), reference, authority, granted_at, expires_at, status.
- `certificates`: certificates issued to students of an institution.
  Columns: institution_id (FK), student_id (FK), title, reference, issued_at, status, signed.
- `sync_history`: synchronization job records per institution + resource type.
  Columns: institution_id (FK), resource, status, items_count, message, started_at, completed_at.
- `validation_lots`: ministry validation batches scoped to an institution.
  Columns: institution_id (FK), reference, type, item_count, status, submitted_at, validated_at, notes.
2. Modified Tables
- `institutions`: add admin_name, admin_email, last_sync_at, sync_percentage, accreditation_count.
- `documents`: add student_id, course_id references for richer linkage.
3. Security
- Single-tenant (no sign-in). RLS enabled on all new tables with anon+authenticated full CRUD.
4. Notes
- All child tables cascade on institution delete where appropriate.
- Students carry NSE for national registry search.
*/

-- Add columns to institutions
ALTER TABLE institutions ADD COLUMN IF NOT EXISTS admin_name text;
ALTER TABLE institutions ADD COLUMN IF NOT EXISTS admin_email text;
ALTER TABLE institutions ADD COLUMN IF NOT EXISTS last_sync_at timestamptz;
ALTER TABLE institutions ADD COLUMN IF NOT EXISTS sync_percentage integer DEFAULT 0;
ALTER TABLE institutions ADD COLUMN IF NOT EXISTS accreditation_count integer DEFAULT 0;
ALTER TABLE institutions ADD COLUMN IF NOT EXISTS course_count integer DEFAULT 0;

-- Add student_id to documents
ALTER TABLE documents ADD COLUMN IF NOT EXISTS student_id uuid;

-- Students
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  nse text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  gender text DEFAULT 'M',
  birth_date date,
  promotion text,
  faculty text,
  department text,
  email text,
  phone text,
  status text NOT NULL DEFAULT 'actif',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_students" ON students;
CREATE POLICY "anon_select_students" ON students FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_students" ON students;
CREATE POLICY "anon_insert_students" ON students FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_students" ON students;
CREATE POLICY "anon_update_students" ON students FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_students" ON students;
CREATE POLICY "anon_delete_students" ON students FOR DELETE TO anon, authenticated USING (true);

-- Add FK from documents to students
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'documents_student_id_fkey') THEN
    ALTER TABLE documents ADD CONSTRAINT documents_student_id_fkey
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Programs
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text,
  faculty text,
  level text DEFAULT 'Licence',
  duration text,
  status text NOT NULL DEFAULT 'actif',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_programs" ON programs;
CREATE POLICY "anon_select_programs" ON programs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_programs" ON programs;
CREATE POLICY "anon_insert_programs" ON programs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_programs" ON programs;
CREATE POLICY "anon_update_programs" ON programs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_programs" ON programs;
CREATE POLICY "anon_delete_programs" ON programs FOR DELETE TO anon, authenticated USING (true);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  program_id uuid REFERENCES programs(id) ON DELETE SET NULL,
  name text NOT NULL,
  code text,
  credits integer DEFAULT 0,
  semester text,
  status text NOT NULL DEFAULT 'actif',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_courses" ON courses;
CREATE POLICY "anon_select_courses" ON courses FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_courses" ON courses;
CREATE POLICY "anon_insert_courses" ON courses FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_courses" ON courses;
CREATE POLICY "anon_update_courses" ON courses FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_courses" ON courses;
CREATE POLICY "anon_delete_courses" ON courses FOR DELETE TO anon, authenticated USING (true);

-- Accreditations
CREATE TABLE IF NOT EXISTS accreditations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  reference text NOT NULL,
  authority text,
  granted_at date,
  expires_at date,
  status text NOT NULL DEFAULT 'actif',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE accreditations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_accreditations" ON accreditations;
CREATE POLICY "anon_select_accreditations" ON accreditations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_accreditations" ON accreditations;
CREATE POLICY "anon_insert_accreditations" ON accreditations FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_accreditations" ON accreditations;
CREATE POLICY "anon_update_accreditations" ON accreditations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_accreditations" ON accreditations;
CREATE POLICY "anon_delete_accreditations" ON accreditations FOR DELETE TO anon, authenticated USING (true);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students(id) ON DELETE SET NULL,
  title text NOT NULL,
  reference text NOT NULL,
  issued_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'émis',
  signed boolean NOT NULL DEFAULT false,
  signed_by text,
  signed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_certificates" ON certificates;
CREATE POLICY "anon_select_certificates" ON certificates FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_certificates" ON certificates;
CREATE POLICY "anon_insert_certificates" ON certificates FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_certificates" ON certificates;
CREATE POLICY "anon_update_certificates" ON certificates FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_certificates" ON certificates;
CREATE POLICY "anon_delete_certificates" ON certificates FOR DELETE TO anon, authenticated USING (true);

-- Sync history
CREATE TABLE IF NOT EXISTS sync_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  resource text NOT NULL,
  status text NOT NULL DEFAULT 'succès',
  items_count integer DEFAULT 0,
  message text,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sync_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_sync_history" ON sync_history;
CREATE POLICY "anon_select_sync_history" ON sync_history FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_sync_history" ON sync_history;
CREATE POLICY "anon_insert_sync_history" ON sync_history FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_sync_history" ON sync_history;
CREATE POLICY "anon_update_sync_history" ON sync_history FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_sync_history" ON sync_history;
CREATE POLICY "anon_delete_sync_history" ON sync_history FOR DELETE TO anon, authenticated USING (true);

-- Validation lots
CREATE TABLE IF NOT EXISTS validation_lots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  reference text NOT NULL,
  type text NOT NULL DEFAULT 'étudiants',
  item_count integer DEFAULT 0,
  status text NOT NULL DEFAULT 'en_attente',
  submitted_at timestamptz DEFAULT now(),
  validated_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE validation_lots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_validation_lots" ON validation_lots;
CREATE POLICY "anon_select_validation_lots" ON validation_lots FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_validation_lots" ON validation_lots;
CREATE POLICY "anon_insert_validation_lots" ON validation_lots FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_validation_lots" ON validation_lots;
CREATE POLICY "anon_update_validation_lots" ON validation_lots FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_validation_lots" ON validation_lots;
CREATE POLICY "anon_delete_validation_lots" ON validation_lots FOR DELETE TO anon, authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_students_institution_id ON students(institution_id);
CREATE INDEX IF NOT EXISTS idx_students_nse ON students(nse);
CREATE INDEX IF NOT EXISTS idx_programs_institution_id ON programs(institution_id);
CREATE INDEX IF NOT EXISTS idx_courses_institution_id ON courses(institution_id);
CREATE INDEX IF NOT EXISTS idx_accreditations_institution_id ON accreditations(institution_id);
CREATE INDEX IF NOT EXISTS idx_certificates_institution_id ON certificates(institution_id);
CREATE INDEX IF NOT EXISTS idx_sync_history_institution_id ON sync_history(institution_id);
CREATE INDEX IF NOT EXISTS idx_validation_lots_institution_id ON validation_lots(institution_id);
CREATE INDEX IF NOT EXISTS idx_documents_student_id ON documents(student_id);
