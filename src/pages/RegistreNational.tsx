import { useState } from 'react';
import { supabase } from '@/lib/supabase';

import {
  Search, User, FileText, Award, GraduationCap, Building2,
  ChevronRight, ArrowRight, AlertCircle
} from 'lucide-react';

type SearchResult = {
  type: 'student' | 'document' | 'certificate' | 'formation';
  id: string;
  title: string;
  subtitle: string;
  reference: string;
  institution_id: string | null;
  institution_name: string;
};

interface RawRelation {
  name: string;
}
interface RawStudentRow {
  id: string;
  nse: string;
  first_name: string;
  last_name: string;
  faculty: string | null;
  department: string | null;
  institution_id: string;
  institutions: RawRelation;
}
interface RawDocRow {
  id: string;
  title: string;
  reference: string;
  type: string;
  student_name: string | null;
  institution_id: string | null;
  institutions: RawRelation | null;
}
interface RawCertRow {
  id: string;
  title: string;
  reference: string;
  institution_id: string;
  institutions: RawRelation | null;
}
interface RawFormationRow {
  id: string;
  name: string;
  filiere: string;
  level: string;
  institution_id: string | null;
  institutions: RawRelation | null;
}

export default function RegistreNational({ onOpenInstitution }: { onOpenInstitution: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setHasSearched(true);
    const q = query.trim();
    const found: SearchResult[] = [];

    // Search students by NSE or name
    const { data: students } = await supabase
      .from('students')
      .select('id, nse, first_name, last_name, faculty, department, institution_id, institutions!inner(name)')
      .or(`nse.ilike.%${q}%,first_name.ilike.%${q}%,last_name.ilike.%${q}%`)
      .limit(20);
    if (students) {
      for (const s of students as unknown as RawStudentRow[]) {
        found.push({
          type: 'student',
          id: s.id,
          title: `${s.first_name} ${s.last_name}`,
          subtitle: `${s.faculty || ''} ${s.department ? '• ' + s.department : ''}`,
          reference: s.nse,
          institution_id: s.institution_id,
          institution_name: s.institutions?.name || '—',
        });
      }
    }

    // Search documents
    const { data: docs } = await supabase
      .from('documents')
      .select('id, title, reference, type, student_name, institution_id, institutions(name)')
      .or(`reference.ilike.%${q}%,title.ilike.%${q}%,student_name.ilike.%${q}%`)
      .limit(20);
    if (docs) {
      for (const d of docs as unknown as RawDocRow[]) {
        found.push({
          type: 'document',
          id: d.id,
          title: d.title,
          subtitle: `${d.type}${d.student_name ? ' • ' + d.student_name : ''}`,
          reference: d.reference,
          institution_id: d.institution_id,
          institution_name: d.institutions?.name || '—',
        });
      }
    }

    // Search certificates
    const { data: certs } = await supabase
      .from('certificates')
      .select('id, title, reference, institution_id, institutions(name)')
      .or(`reference.ilike.%${q}%,title.ilike.%${q}%`)
      .limit(20);
    if (certs) {
      for (const c of certs as unknown as RawCertRow[]) {
        found.push({
          type: 'certificate',
          id: c.id,
          title: c.title,
          subtitle: 'Certificat',
          reference: c.reference,
          institution_id: c.institution_id,
          institution_name: c.institutions?.name || '—',
        });
      }
    }

    // Search formations
    const { data: formations } = await supabase
      .from('formations')
      .select('id, name, filiere, level, institution_id, institutions(name)')
      .or(`name.ilike.%${q}%,filiere.ilike.%${q}%`)
      .limit(20);
    if (formations) {
      for (const f of formations as unknown as RawFormationRow[]) {
        found.push({
          type: 'formation',
          id: f.id,
          title: f.name,
          subtitle: `${f.filiere} • ${f.level}`,
          reference: f.level,
          institution_id: f.institution_id,
          institution_name: f.institutions?.name || '—',
        });
      }
    }

    setResults(found);
    setSearching(false);
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'student': return <User size={16} className="text-blue-600" />;
      case 'document': return <FileText size={16} className="text-violet-600" />;
      case 'certificate': return <Award size={16} className="text-amber-600" />;
      case 'formation': return <GraduationCap size={16} className="text-teal-600" />;
    }
  };

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'student': return 'Étudiant';
      case 'document': return 'Document';
      case 'certificate': return 'Certificat';
      case 'formation': return 'Formation';
    }
  };

  const getTypeBg = (type: SearchResult['type']) => {
    switch (type) {
      case 'student': return 'bg-blue-50';
      case 'document': return 'bg-violet-50';
      case 'certificate': return 'bg-amber-50';
      case 'formation': return 'bg-teal-50';
    }
  };

  return (
    <div className="px-5 pb-6">
      <div className="py-4">
        <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-1">
          <span>NOVARIS</span><ChevronRight size={11} /><span>Registre National</span>
        </div>
        <h2 className="text-base font-bold text-gray-900">Registre National (NSE)</h2>
        <p className="text-[11px] text-gray-500">
          Recherche globale par NSE, nom d'étudiant, référence de document, diplôme ou certificat.
          Le système vous redirige vers l'institution correspondante.
        </p>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="NSE-2026-00000456, Jean NDAYISHIMIYE, DIP-2025-001234, CERT-2025-..."
              className="w-full pl-10 pr-3 py-3 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors"
              autoFocus
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searching || !query.trim()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium px-5 py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {searching ? <RefreshCwIcon /> : <Search size={16} />}
            {searching ? 'Recherche...' : 'Rechercher'}
          </button>
        </div>

        {/* Quick examples */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-gray-400">Exemples :</span>
          {['NSE-2025-000001', 'NDAYISHIMIYE', 'DIP-2025-001234', 'Informatique'].map(ex => (
            <button
              key={ex}
              onClick={() => { setQuery(ex); }}
              className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {hasSearched && !searching && (
        <div>
          {results.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 py-16 flex flex-col items-center gap-2 text-gray-400">
              <AlertCircle size={32} className="text-gray-300" />
              <div className="text-[12px]">Aucun résultat trouvé pour "{query}"</div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] text-gray-600">{results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}</span>
              </div>
              <div className="space-y-2">
                {results.map(r => (
                  <div
                    key={`${r.type}-${r.id}`}
                    className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-sm transition-all"
                  >
                    <div className={`w-10 h-10 rounded-lg ${getTypeBg(r.type)} flex items-center justify-center shrink-0`}>
                      {getTypeIcon(r.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-medium text-gray-900 truncate">{r.title}</span>
                        <span className="text-[9px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded shrink-0">{getTypeLabel(r.type)}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 truncate">{r.subtitle}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{r.reference}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <div className="text-[9px] text-gray-400 uppercase tracking-wider">Institution</div>
                        <div className="text-[11px] text-gray-700 font-medium flex items-center gap-1">
                          <Building2 size={11} className="text-gray-400" />
                          {r.institution_name}
                        </div>
                      </div>
                      {r.institution_id && (
                        <button
                          onClick={() => onOpenInstitution(r.institution_id!)}
                          className="flex items-center gap-1 text-[11px] text-blue-600 font-medium hover:gap-2 transition-all"
                        >
                          Voir la fiche <ArrowRight size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Default state */}
      {!hasSearched && (
        <div className="bg-white rounded-xl border border-gray-100 py-16 flex flex-col items-center gap-3 text-gray-400">
          <Search size={40} className="text-gray-200" />
          <div className="text-[13px] font-medium text-gray-500">Recherchez dans tout le registre national</div>
          <div className="text-[11px] text-gray-400 max-w-md text-center">
            Étudiants (NSE), documents, diplômes, certificats et formations.
            Chaque résultat vous indique l'institution propriétaire et vous permet d'accéder à sa fiche.
          </div>
        </div>
      )}
    </div>
  );
}

function RefreshCwIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>;
}
