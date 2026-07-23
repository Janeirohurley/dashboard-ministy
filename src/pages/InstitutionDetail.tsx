import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type {
  Institution, Student, Program, Course, Accreditation, Certificate,
  DocumentItem, SyncHistoryItem, ValidationLot, SyncResource
} from '@/types';
import { STATUS_LABELS, SYNC_RESOURCES, SYNC_RESOURCE_LABELS } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import {
  ArrowLeft, Building2, MapPin, Mail, Phone, User, Award, Clock,
  LayoutDashboard, Users, FileText, GraduationCap, BookOpen, RefreshCw,
  History, CheckSquare, PenTool, ChevronRight, Search, Stamp,
  CheckCircle2, XCircle, AlertCircle, Download, Plus, Trash2
} from 'lucide-react';

type TabId = 'dashboard' | 'etudiants' | 'documents' | 'certificats' | 'formations' | 'programmes' | 'sync' | 'historique' | 'validation' | 'signatures';

const TABS: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'etudiants', label: 'Étudiants', icon: Users },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'certificats', label: 'Certificats', icon: Award },
  { id: 'formations', label: 'Formations', icon: GraduationCap },
  { id: 'programmes', label: 'Programmes', icon: BookOpen },
  { id: 'sync', label: 'Synchronisation', icon: RefreshCw },
  { id: 'historique', label: 'Historique Sync', icon: History },
  { id: 'validation', label: 'Validation Min.', icon: CheckSquare },
  { id: 'signatures', label: 'Signatures', icon: PenTool },
];

export default function InstitutionDetail({ institutionId, onBack }: { institutionId: string; onBack: () => void }) {
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .eq('id', institutionId)
        .maybeSingle();
      if (!error && data) setInstitution(data as Institution);
      setLoading(false);
    })();
  }, [institutionId]);

  if (loading) return <div className="px-5 py-16 text-center text-gray-400 text-[12px]">Chargement...</div>;
  if (!institution) return <div className="px-5 py-16 text-center text-gray-400 text-[12px]">Institution introuvable</div>;

  return (
    <div className="px-5 pb-6">
      {/* Breadcrumb + back */}
      <div className="flex items-center gap-2 py-3">
        <button onClick={onBack} className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-blue-600 transition-colors">
          <ArrowLeft size={13} /> Institutions
        </button>
        <ChevronRight size={11} className="text-gray-300" />
        <span className="text-[11px] text-gray-700 font-medium truncate">{institution.name}</span>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Building2 size={26} className="text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 leading-tight">{institution.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <StatusBadge status={institution.status} />
              <span className="text-[11px] text-gray-500">{institution.type}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mt-4">
          <HeaderInfo icon={<MapPin size={12} />} label="Province" value={institution.province} />
          <HeaderInfo icon={<User size={12} />} label="Administrateur" value={institution.admin_name || institution.director || '—'} />
          <HeaderInfo icon={<Mail size={12} />} label="Email admin" value={institution.admin_email || institution.email || '—'} />
          <HeaderInfo icon={<Clock size={12} />} label="Dernière sync" value={institution.last_sync_at ? formatDate(institution.last_sync_at) : 'Jamais'} />
        </div>
        <div className="flex items-center gap-3 mt-3">
          <HeaderInfo icon={<Award size={12} />} label="Accréditations" value={String(institution.accreditation_count)} />
          <HeaderInfo icon={<Users size={12} />} label="Étudiants" value={institution.student_count.toLocaleString()} />
          <HeaderInfo icon={<GraduationCap size={12} />} label="Formations" value={String(institution.formation_count)} />
          <HeaderInfo icon={<BookOpen size={12} />} label="Cours" value={String(institution.course_count)} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-4 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={13} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'dashboard' && <DashboardTab institution={institution} />}
      {activeTab === 'etudiants' && <StudentsTab institutionId={institution.id} />}
      {activeTab === 'documents' && <DocumentsTab institutionId={institution.id} />}
      {activeTab === 'certificats' && <CertificatesTab institutionId={institution.id} />}
      {activeTab === 'formations' && <FormationsTab institutionId={institution.id} />}
      {activeTab === 'programmes' && <ProgramsTab institutionId={institution.id} />}
      {activeTab === 'sync' && <SyncTab institutionId={institution.id} institutionName={institution.name} />}
      {activeTab === 'historique' && <HistoryTab institutionId={institution.id} />}
      {activeTab === 'validation' && <ValidationTab institutionId={institution.id} />}
      {activeTab === 'signatures' && <SignaturesTab institutionId={institution.id} />}
    </div>
  );
}

function HeaderInfo({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400">{icon}</span>
      <div>
        <div className="text-[9px] text-gray-400 uppercase tracking-wider">{label}</div>
        <div className="text-[11px] text-gray-700 font-medium truncate">{value}</div>
      </div>
    </div>
  );
}

// ============ DASHBOARD TAB ============
function DashboardTab({ institution }: { institution: Institution }) {
  const stats = [
    { icon: <Users size={16} />, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', label: 'Étudiants', value: institution.student_count.toLocaleString() },
    { icon: <GraduationCap size={16} />, iconBg: 'bg-violet-50', iconColor: 'text-violet-600', label: 'Formations', value: institution.formation_count },
    { icon: <BookOpen size={16} />, iconBg: 'bg-teal-50', iconColor: 'text-teal-600', label: 'Cours', value: institution.course_count },
    { icon: <Award size={16} />, iconBg: 'bg-amber-50', iconColor: 'text-amber-600', label: 'Certificats', value: '—' },
    { icon: <FileText size={16} />, iconBg: 'bg-cyan-50', iconColor: 'text-cyan-600', label: 'Documents', value: '—' },
    { icon: <Award size={16} />, iconBg: 'bg-green-50', iconColor: 'text-green-600', label: 'Accréditations', value: institution.accreditation_count },
    { icon: <RefreshCw size={16} />, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', label: 'Synchronisation', value: `${institution.sync_percentage}%` },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map(s => (
        <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
          <div className={`w-9 h-9 rounded-lg ${s.iconBg} flex items-center justify-center mb-2`}>
            <span className={s.iconColor}>{s.icon}</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{s.value}</div>
          <div className="text-[10px] text-gray-500">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ============ STUDENTS TAB ============
function StudentsTab({ institutionId }: { institutionId: string }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('institution_id', institutionId)
      .order('last_name', { ascending: true });
    if (!error && data) setStudents(data as Student[]);
    setLoading(false);
  }, [institutionId]);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = students.filter(s =>
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    s.nse.toLowerCase().includes(search.toLowerCase()) ||
    (s.faculty || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.department || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.promotion || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par nom, NSE, promotion, faculté, département..." className="w-full pl-9 pr-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors" />
        </div>
        <span className="text-[11px] text-gray-500">{filtered.length} étudiant{filtered.length > 1 ? 's' : ''}</span>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? <div className="py-12 text-center text-gray-400 text-[12px]">Chargement...</div> : filtered.length === 0 ? (
          <EmptyState message="Aucun étudiant trouvé" />
        ) : (
          <table className="w-full">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <Th>NSE</Th><Th>Nom complet</Th><Th>Genre</Th><Th>Promotion</Th><Th>Faculté</Th><Th>Département</Th><Th>Statut</Th>
            </tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-[11px] text-gray-600 font-mono">{s.nse}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-[10px] font-bold text-blue-600">{s.first_name[0]}{s.last_name[0]}</div>
                      <span className="text-[12px] font-medium text-gray-900">{s.first_name} {s.last_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-gray-600">{s.gender === 'M' ? 'Homme' : 'Femme'}</td>
                  <td className="px-4 py-3 text-[11px] text-gray-600">{s.promotion || '—'}</td>
                  <td className="px-4 py-3 text-[11px] text-gray-600">{s.faculty || '—'}</td>
                  <td className="px-4 py-3 text-[11px] text-gray-600">{s.department || '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ============ DOCUMENTS TAB ============
function DocumentsTab({ institutionId }: { institutionId: string }) {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('documents')
      .select('*, institutions(*)')
      .eq('institution_id', institutionId)
      .order('created_at', { ascending: false });
    if (!error && data) setDocs(data as DocumentItem[]);
    setLoading(false);
  }, [institutionId]);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = docs.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.reference.toLowerCase().includes(search.toLowerCase()) ||
    (d.student_name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par titre, référence, étudiant..." className="w-full pl-9 pr-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors" />
        </div>
        <span className="text-[11px] text-gray-500">{filtered.length} document{filtered.length > 1 ? 's' : ''}</span>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? <div className="py-12 text-center text-gray-400 text-[12px]">Chargement...</div> : filtered.length === 0 ? (
          <EmptyState message="Aucun document trouvé" />
        ) : (
          <table className="w-full">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <Th>Document</Th><Th>Référence</Th><Th>Type</Th><Th>Étudiant</Th><Th>Statut</Th><Th>Signature</Th>
            </tr></thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-[12px] font-medium text-gray-900 truncate max-w-[200px]">{d.title}</td>
                  <td className="px-4 py-3 text-[11px] text-gray-600 font-mono">{d.reference}</td>
                  <td className="px-4 py-3 text-[11px] text-gray-600">{d.type}</td>
                  <td className="px-4 py-3 text-[11px] text-gray-600">{d.student_name || '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                  <td className="px-4 py-3">
                    {d.signed ? <span className="flex items-center gap-1 text-[10px] text-violet-600 font-medium"><Stamp size={11} /> {formatDate(d.signed_at!)}</span> : <span className="text-[10px] text-gray-400">Non signé</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ============ CERTIFICATES TAB ============
function CertificatesTab({ institutionId }: { institutionId: string }) {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('institution_id', institutionId)
      .order('issued_at', { ascending: false });
    if (!error && data) setCerts(data as Certificate[]);
    setLoading(false);
  }, [institutionId]);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {loading ? <div className="py-12 text-center text-gray-400 text-[12px]">Chargement...</div> : certs.length === 0 ? (
        <EmptyState message="Aucun certificat trouvé" />
      ) : (
        <table className="w-full">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <Th>Titre</Th><Th>Référence</Th><Th>Émis le</Th><Th>Statut</Th><Th>Signature</Th>
          </tr></thead>
          <tbody>
            {certs.map(c => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-[12px] font-medium text-gray-900">{c.title}</td>
                <td className="px-4 py-3 text-[11px] text-gray-600 font-mono">{c.reference}</td>
                <td className="px-4 py-3 text-[10px] text-gray-400">{formatDate(c.issued_at)}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3">
                  {c.signed ? <span className="flex items-center gap-1 text-[10px] text-violet-600 font-medium"><Stamp size={11} /> {c.signed_by}</span> : <span className="text-[10px] text-gray-400">Non signé</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ============ FORMATIONS TAB ============
function FormationsTab({ institutionId }: { institutionId: string }) {
  const [formations, setFormations] = useState<{ id: string; name: string; filiere: string; level: string; duration: string | null; status: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('formations')
        .select('id, name, filiere, level, duration, status')
        .eq('institution_id', institutionId)
        .order('name');
      if (!error && data) setFormations(data as { id: string; name: string; filiere: string; level: string; duration: string | null; status: string }[]);
      setLoading(false);
    })();
  }, [institutionId]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {loading ? <div className="py-12 text-center text-gray-400 text-[12px]">Chargement...</div> : formations.length === 0 ? (
        <EmptyState message="Aucune formation trouvée" />
      ) : (
        <table className="w-full">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <Th>Formation</Th><Th>Filière</Th><Th>Niveau</Th><Th>Durée</Th><Th>Statut</Th>
          </tr></thead>
          <tbody>
            {formations.map(f => (
              <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-[12px] font-medium text-gray-900">{f.name}</td>
                <td className="px-4 py-3 text-[11px] text-gray-600">{f.filiere}</td>
                <td className="px-4 py-3 text-[11px] text-gray-600">{f.level}</td>
                <td className="px-4 py-3 text-[11px] text-gray-600">{f.duration || '—'}</td>
                <td className="px-4 py-3"><StatusBadge status={f.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ============ PROGRAMS TAB ============
function ProgramsTab({ institutionId }: { institutionId: string }) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('institution_id', institutionId)
        .order('name');
      if (!error && data) setPrograms(data as Program[]);
      setLoading(false);
    })();
  }, [institutionId]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {loading ? <div className="py-12 text-center text-gray-400 text-[12px]">Chargement...</div> : programs.length === 0 ? (
        <EmptyState message="Aucun programme trouvé" />
      ) : (
        <table className="w-full">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <Th>Programme</Th><Th>Code</Th><Th>Faculté</Th><Th>Niveau</Th><Th>Durée</Th><Th>Statut</Th>
          </tr></thead>
          <tbody>
            {programs.map(p => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-[12px] font-medium text-gray-900">{p.name}</td>
                <td className="px-4 py-3 text-[11px] text-gray-600 font-mono">{p.code || '—'}</td>
                <td className="px-4 py-3 text-[11px] text-gray-600">{p.faculty || '—'}</td>
                <td className="px-4 py-3 text-[11px] text-gray-600">{p.level}</td>
                <td className="px-4 py-3 text-[11px] text-gray-600">{p.duration || '—'}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ============ SYNC TAB ============
function SyncTab({ institutionId, institutionName }: { institutionId: string; institutionName: string }) {
  const [selected, setSelected] = useState<Set<SyncResource>>(new Set());
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<{ resources: string[]; count: number } | null>(null);

  const toggle = (r: SyncResource) => {
    const next = new Set(selected);
    if (next.has(r)) next.delete(r); else next.add(r);
    setSelected(next);
  };

  const handleSync = async () => {
    if (selected.size === 0) return;
    setSyncing(true);
    const resources = Array.from(selected);
    for (const resource of resources) {
      await supabase.from('sync_history').insert({
        institution_id: institutionId,
        resource,
        status: 'succès',
        items_count: Math.floor(Math.random() * 500) + 10,
        message: `${SYNC_RESOURCE_LABELS[resource]} synchronisé avec succès`,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      });
    }
    await supabase.from('institutions').update({
      last_sync_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', institutionId);

    setResult({ resources, count: resources.length });
    setSelected(new Set());
    setSyncing(false);
    setTimeout(() => setResult(null), 5000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-1">Synchronisation sélective</h3>
      <p className="text-[11px] text-gray-500 mb-4">
        Sélectionnez les ressources à synchroniser pour <span className="font-medium text-gray-700">{institutionName}</span>.
        Le backend créera une tâche par ressource cochée.
      </p>

      <div className="grid grid-cols-4 gap-2 mb-5">
        {SYNC_RESOURCES.map(r => {
          const checked = selected.has(r);
          return (
            <button
              key={r}
              onClick={() => toggle(r)}
              className={`flex items-center gap-2 p-3 rounded-lg border transition-all text-left ${
                checked ? 'border-blue-400 bg-blue-50 ring-1 ring-blue-100' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                {checked && <CheckCircle2 size={12} className="text-white" />}
              </div>
              <span className={`text-[11px] font-medium ${checked ? 'text-blue-700' : 'text-gray-700'}`}>{SYNC_RESOURCE_LABELS[r]}</span>
            </button>
          );
        })}
      </div>

      {result && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span className="text-[12px] text-emerald-700">
            {result.count} tâche{result.count > 1 ? 's' : ''} de synchronisation créée{result.count > 1 ? 's' : ''} pour : {result.resources.map(r => SYNC_RESOURCE_LABELS[r]).join(', ')}
          </span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSync}
          disabled={syncing || selected.size === 0}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Synchronisation...' : 'Synchroniser'}
        </button>
        <span className="text-[11px] text-gray-500">{selected.size} ressource{selected.size > 1 ? 's' : ''} sélectionnée{selected.size > 1 ? 's' : ''}</span>
      </div>

      {/* JSON payload preview */}
      {selected.size > 0 && (
        <div className="mt-4 p-3 bg-gray-900 rounded-lg overflow-x-auto">
          <div className="text-[9px] text-gray-500 mb-1 font-mono">Payload envoyé au backend :</div>
          <pre className="text-[10px] text-emerald-400 font-mono">{JSON.stringify({ institution: institutionName, resources: Array.from(selected) }, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

// ============ HISTORY TAB ============
function HistoryTab({ institutionId }: { institutionId: string }) {
  const [items, setItems] = useState<SyncHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('sync_history')
        .select('*')
        .eq('institution_id', institutionId)
        .order('started_at', { ascending: false });
      if (!error && data) setItems(data as SyncHistoryItem[]);
      setLoading(false);
    })();
  }, [institutionId]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {loading ? <div className="py-12 text-center text-gray-400 text-[12px]">Chargement...</div> : items.length === 0 ? (
        <EmptyState message="Aucun historique de synchronisation" />
      ) : (
        <table className="w-full">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <Th>Date</Th><Th>Ressource</Th><Th>Statut</Th><Th>Éléments</Th><Th>Message</Th><Th>Durée</Th>
          </tr></thead>
          <tbody>
            {items.map(h => (
              <tr key={h.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-[10px] text-gray-500">{formatDateTime(h.started_at)}</td>
                <td className="px-4 py-3 text-[11px] font-medium text-gray-700">{SYNC_RESOURCE_LABELS[h.resource] || h.resource}</td>
                <td className="px-4 py-3"><StatusBadge status={h.status} /></td>
                <td className="px-4 py-3 text-[11px] text-gray-600">{h.items_count > 0 ? `${h.items_count} élém.` : '—'}</td>
                <td className="px-4 py-3 text-[10px] text-gray-500 truncate max-w-[200px]">{h.message || '—'}</td>
                <td className="px-4 py-3 text-[10px] text-gray-400">{h.completed_at ? formatDuration(h.started_at, h.completed_at) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ============ VALIDATION TAB ============
function ValidationTab({ institutionId }: { institutionId: string }) {
  const [lots, setLots] = useState<ValidationLot[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('validation_lots')
      .select('*')
      .eq('institution_id', institutionId)
      .order('submitted_at', { ascending: false });
    if (!error && data) setLots(data as ValidationLot[]);
    setLoading(false);
  }, [institutionId]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAction = async (id: string, status: string) => {
    await supabase.from('validation_lots').update({
      status,
      validated_at: status === 'validé' || status === 'rejeté' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }).eq('id', id);
    loadData();
  };

  const stats = {
    total: lots.length,
    enAttente: lots.filter(l => l.status === 'en_attente').length,
    valide: lots.filter(l => l.status === 'validé').length,
    rejete: lots.filter(l => l.status === 'rejeté').length,
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-3">
        <MiniStat label="Total lots" value={stats.total} color="text-gray-900" />
        <MiniStat label="En attente" value={stats.enAttente} color="text-blue-600" />
        <MiniStat label="Validés" value={stats.valide} color="text-emerald-600" />
        <MiniStat label="Rejetés" value={stats.rejete} color="text-red-600" />
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? <div className="py-12 text-center text-gray-400 text-[12px]">Chargement...</div> : lots.length === 0 ? (
          <EmptyState message="Aucun lot de validation" />
        ) : (
          <table className="w-full">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <Th>Référence</Th><Th>Type</Th><Th>Éléments</Th><Th>Statut</Th><Th>Soumis le</Th><Th>Validé le</Th><Th className="text-right">Actions</Th>
            </tr></thead>
            <tbody>
              {lots.map(l => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-[11px] font-mono text-gray-700">{l.reference}</td>
                  <td className="px-4 py-3 text-[11px] text-gray-600 capitalize">{l.type}</td>
                  <td className="px-4 py-3 text-[11px] text-gray-600">{l.item_count}</td>
                  <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                  <td className="px-4 py-3 text-[10px] text-gray-400">{formatDate(l.submitted_at)}</td>
                  <td className="px-4 py-3 text-[10px] text-gray-400">{l.validated_at ? formatDate(l.validated_at) : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {l.status === 'en_attente' && (
                        <>
                          <button onClick={() => handleAction(l.id, 'rejeté')} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors" title="Rejeter">
                            <XCircle size={14} />
                          </button>
                          <button onClick={() => handleAction(l.id, 'validé')} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors" title="Valider">
                            <CheckCircle2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ============ SIGNATURES TAB ============
function SignaturesTab({ institutionId }: { institutionId: string }) {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('documents')
      .select('*, institutions(*)')
      .eq('institution_id', institutionId)
      .order('created_at', { ascending: false });
    if (!error && data) setDocs(data as DocumentItem[]);
    setLoading(false);
  }, [institutionId]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSign = async (id: string) => {
    await supabase.from('documents').update({
      status: 'signe', signed: true, signed_at: new Date().toISOString(),
      signed_by: 'Dr. Jean NDUWIMANA', updated_at: new Date().toISOString(),
    }).eq('id', id);
    loadData();
  };

  const stats = {
    total: docs.length,
    signe: docs.filter(d => d.signed).length,
    enAttente: docs.filter(d => !d.signed && d.status !== 'rejete').length,
    erreurs: docs.filter(d => d.status === 'rejete').length,
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-3">
        <MiniStat label="Total signatures" value={stats.total} color="text-gray-900" />
        <MiniStat label="En attente" value={stats.enAttente} color="text-amber-600" />
        <MiniStat label="Signés" value={stats.signe} color="text-violet-600" />
        <MiniStat label="Erreurs" value={stats.erreurs} color="text-red-600" />
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? <div className="py-12 text-center text-gray-400 text-[12px]">Chargement...</div> : docs.length === 0 ? (
          <EmptyState message="Aucune signature" />
        ) : (
          <table className="w-full">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <Th>Document</Th><Th>Référence</Th><Th>Statut</Th><Th>Signé par</Th><Th>Date</Th><Th className="text-right">Action</Th>
            </tr></thead>
            <tbody>
              {docs.map(d => (
                <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-[12px] font-medium text-gray-900 truncate max-w-[200px]">{d.title}</td>
                  <td className="px-4 py-3 text-[11px] text-gray-600 font-mono">{d.reference}</td>
                  <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                  <td className="px-4 py-3 text-[11px] text-gray-600">{d.signed_by || '—'}</td>
                  <td className="px-4 py-3 text-[10px] text-gray-400">{d.signed_at ? formatDate(d.signed_at) : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    {!d.signed && d.status !== 'rejete' && (
                      <button onClick={() => handleSign(d.id)} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors text-[10px] font-medium ml-auto">
                        <PenTool size={12} /> Signer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ============ Shared ============
function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3">
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-[10px] text-gray-500">{label}</div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-12 flex flex-col items-center gap-2 text-gray-400">
      <AlertCircle size={28} className="text-gray-300" />
      <div className="text-[12px]">{message}</div>
    </div>
  );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider ${className}`}>{children}</th>;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatDuration(start: string, end: string): string {
  const diff = new Date(end).getTime() - new Date(start).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
}
