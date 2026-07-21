import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Institution, Formation, InstitutionStatus, FormationStatus } from '@/types';
import { STATUS_LABELS } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import Modal, { Field, Input, Select, TextArea } from '@/components/Modal';
import {
  Search, Plus, CheckCircle2, XCircle, AlertCircle, Building2,
  GraduationCap, Users, FileText, Eye, ChevronLeft, ChevronRight,
  Check, RefreshCw, Download
} from 'lucide-react';

type Tab = 'institutions' | 'formations';

const INSTITUTION_TYPES = ['Université', 'Institut', 'École', 'Centre de formation'];
const PROVINCES = ['Bujumbura Mairie', 'Gitega', 'Ngozi', 'Bujumbura Rural', 'Bururi', 'Muyinga'];
const FILIERES = ['Sciences', 'Lettres', 'Techniques', 'Économie', 'Agronomie', 'Médecine'];
const LEVELS = ['Baccalauréat', 'Licence', 'Master', 'Doctorat', 'Certificat'];

export default function ValidationCenter() {
  const [tab, setTab] = useState<Tab>('institutions');
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Institution | Formation | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    if (tab === 'institutions') {
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .order('submitted_at', { ascending: false });
      if (!error && data) setInstitutions(data as Institution[]);
    } else {
      const { data, error } = await supabase
        .from('formations')
        .select('*, institutions(*)')
        .order('submitted_at', { ascending: false });
      if (!error && data) setFormations(data as Formation[]);
    }
    setLoading(false);
  }, [tab]);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredInstitutions = institutions.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
      (i.director || '').toLowerCase().includes(search.toLowerCase()) ||
      (i.city || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredFormations = formations.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      (f.institutions?.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = async (id: string, status: InstitutionStatus | FormationStatus) => {
    setActionLoading(true);
    const table = tab === 'institutions' ? 'institutions' : 'formations';
    const { error } = await supabase
      .from(table)
      .update({ status, validated_at: status === 'approuve' || status === 'rejete' ? new Date().toISOString() : null, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) {
      await loadData();
      setDetailOpen(false);
    }
    setActionLoading(false);
  };

  const stats = {
    enAttente: tab === 'institutions'
      ? institutions.filter(i => i.status === 'en_attente').length
      : formations.filter(f => f.status === 'en_attente').length,
    enRevision: tab === 'institutions'
      ? institutions.filter(i => i.status === 'en_revision').length
      : formations.filter(f => f.status === 'en_revision').length,
    approuve: tab === 'institutions'
      ? institutions.filter(i => i.status === 'approuve').length
      : formations.filter(f => f.status === 'approuve').length,
    rejete: tab === 'institutions'
      ? institutions.filter(i => i.status === 'rejete').length
      : formations.filter(f => f.status === 'rejete').length,
  };

  const openDetail = (item: Institution | Formation) => {
    setSelected(item);
    setDetailOpen(true);
  };

  return (
    <div className="px-5 pb-6">
      {/* Header */}
      <div className="py-4">
        <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-1">
          <span>NOVARIS</span>
          <ChevronRight size={11} />
          <span>Centre de Validation</span>
        </div>
        <h2 className="text-base font-bold text-gray-900">Centre de Validation</h2>
        <p className="text-[11px] text-gray-500">
          Le ministère valide les institutions ainsi que les formations proposées par ces institutions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-4">
        <button
          onClick={() => { setTab('institutions'); setStatusFilter('all'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-[12px] font-medium border-b-2 transition-colors ${
            tab === 'institutions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Building2 size={14} />
          Validation des Institutions
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] bg-gray-100 text-gray-600">{institutions.length}</span>
        </button>
        <button
          onClick={() => { setTab('formations'); setStatusFilter('all'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-[12px] font-medium border-b-2 transition-colors ${
            tab === 'formations' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <GraduationCap size={14} />
          Validation des Formations
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] bg-gray-100 text-gray-600">{formations.length}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <StatPill icon={<AlertCircle size={14} className="text-blue-600" />} bg="bg-blue-50" label="En attente" value={stats.enAttente} />
        <StatPill icon={<RefreshCw size={14} className="text-amber-600" />} bg="bg-amber-50" label="En révision" value={stats.enRevision} />
        <StatPill icon={<CheckCircle2 size={14} className="text-emerald-600" />} bg="bg-emerald-50" label="Approuvés" value={stats.approuve} />
        <StatPill icon={<XCircle size={14} className="text-red-600" />} bg="bg-red-50" label="Rejetés" value={stats.rejete} />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={tab === 'institutions' ? "Rechercher une institution, un directeur..." : "Rechercher une formation, une institution..."}
            className="w-full pl-9 pr-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white cursor-pointer"
        >
          <option value="all">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="en_revision">En révision</option>
          <option value="approuve">Approuvé</option>
          <option value="rejete">Rejeté</option>
        </select>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-medium px-3 py-2 rounded-lg transition-colors"
        >
          <Plus size={14} />
          {tab === 'institutions' ? 'Nouvelle Institution' : 'Nouvelle Formation'}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-[12px]">Chargement...</div>
        ) : tab === 'institutions' ? (
          <InstitutionsTable items={filteredInstitutions} onView={openDetail} onAction={handleAction} />
        ) : (
          <FormationsTable items={filteredFormations} onView={openDetail} onAction={handleAction} />
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={tab === 'institutions' ? 'Détails de l\'institution' : 'Détails de la formation'}
        footer={
          selected && (selected as Institution | Formation).status !== 'approuve' && (selected as Institution | Formation).status !== 'rejete' ? (
            <>
              <button
                onClick={() => handleAction(selected.id, 'rejete' as InstitutionStatus)}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <XCircle size={14} /> Rejeter
              </button>
              <button
                onClick={() => handleAction(selected.id, 'en_revision' as InstitutionStatus)}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-amber-600 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={14} /> Mettre en révision
              </button>
              <button
                onClick={() => handleAction(selected.id, 'approuve' as InstitutionStatus)}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                <CheckCircle2 size={14} /> Approuver
              </button>
            </>
          ) : selected ? (
            <button
              onClick={() => handleAction(selected.id, 'en_attente' as InstitutionStatus)}
              disabled={actionLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} /> Remettre en attente
            </button>
          ) : null
        }
      >
        {selected && <DetailContent item={selected} tab={tab} />}
      </Modal>

      {/* Add Modal */}
      <AddModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        tab={tab}
        institutions={institutions}
        onCreated={loadData}
      />
    </div>
  );
}

function StatPill({ icon, bg, label, value }: { icon: React.ReactNode; bg: string; label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>{icon}</div>
      <div>
        <div className="text-lg font-bold text-gray-900 leading-tight">{value}</div>
        <div className="text-[10px] text-gray-500">{label}</div>
      </div>
    </div>
  );
}

function InstitutionsTable({ items, onView, onAction }: {
  items: Institution[];
  onView: (i: Institution) => void;
  onAction: (id: string, status: InstitutionStatus) => void;
}) {
  if (items.length === 0) {
    return <EmptyState message="Aucune institution trouvée" />;
  }
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-100 bg-gray-50/50">
          <Th>Institution</Th>
          <Th>Type</Th>
          <Th>Province</Th>
          <Th>Directeur</Th>
          <Th>Étudiants</Th>
          <Th>Statut</Th>
          <Th>Soumise le</Th>
          <Th className="text-right">Actions</Th>
        </tr>
      </thead>
      <tbody>
        {items.map(inst => (
          <tr key={inst.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
            <td className="px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Building2 size={14} className="text-blue-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-medium text-gray-900 truncate">{inst.name}</div>
                  <div className="text-[10px] text-gray-400 truncate">{inst.city || '—'}</div>
                </div>
              </div>
            </td>
            <td className="px-4 py-3 text-[11px] text-gray-600">{inst.type}</td>
            <td className="px-4 py-3 text-[11px] text-gray-600">{inst.province}</td>
            <td className="px-4 py-3 text-[11px] text-gray-600">{inst.director || '—'}</td>
            <td className="px-4 py-3 text-[11px] text-gray-600">{inst.student_count.toLocaleString()}</td>
            <td className="px-4 py-3"><StatusBadge status={inst.status} /></td>
            <td className="px-4 py-3 text-[10px] text-gray-400">{formatDate(inst.submitted_at)}</td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <button onClick={() => onView(inst)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Voir détails">
                  <Eye size={14} />
                </button>
                {inst.status !== 'approuve' && inst.status !== 'rejete' ? (
                  <>
                    <button onClick={() => onAction(inst.id, 'rejete')} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors" title="Rejeter">
                      <XCircle size={14} />
                    </button>
                    <button onClick={() => onAction(inst.id, 'approuve')} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors" title="Approuver">
                      <CheckCircle2 size={14} />
                    </button>
                  </>
                ) : (
                  <button onClick={() => onAction(inst.id, 'en_attente')} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Remettre en attente">
                    <RefreshCw size={14} />
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function FormationsTable({ items, onView, onAction }: {
  items: Formation[];
  onView: (f: Formation) => void;
  onAction: (id: string, status: FormationStatus) => void;
}) {
  if (items.length === 0) {
    return <EmptyState message="Aucune formation trouvée" />;
  }
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-100 bg-gray-50/50">
          <Th>Formation</Th>
          <Th>Institution</Th>
          <Th>Filière</Th>
          <Th>Niveau</Th>
          <Th>Durée</Th>
          <Th>Statut</Th>
          <Th>Soumise le</Th>
          <Th className="text-right">Actions</Th>
        </tr>
      </thead>
      <tbody>
        {items.map(f => (
          <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
            <td className="px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                  <GraduationCap size={14} className="text-violet-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-medium text-gray-900 truncate">{f.name}</div>
                  <div className="text-[10px] text-gray-400 truncate">{f.description || '—'}</div>
                </div>
              </div>
            </td>
            <td className="px-4 py-3 text-[11px] text-gray-600">{f.institutions?.name || '—'}</td>
            <td className="px-4 py-3 text-[11px] text-gray-600">{f.filiere}</td>
            <td className="px-4 py-3 text-[11px] text-gray-600">{f.level}</td>
            <td className="px-4 py-3 text-[11px] text-gray-600">{f.duration || '—'}</td>
            <td className="px-4 py-3"><StatusBadge status={f.status} /></td>
            <td className="px-4 py-3 text-[10px] text-gray-400">{formatDate(f.submitted_at)}</td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <button onClick={() => onView(f)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Voir détails">
                  <Eye size={14} />
                </button>
                {f.status !== 'approuve' && f.status !== 'rejete' ? (
                  <>
                    <button onClick={() => onAction(f.id, 'rejete')} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors" title="Rejeter">
                      <XCircle size={14} />
                    </button>
                    <button onClick={() => onAction(f.id, 'approuve')} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors" title="Approuver">
                      <CheckCircle2 size={14} />
                    </button>
                  </>
                ) : (
                  <button onClick={() => onAction(f.id, 'en_attente')} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Remettre en attente">
                    <RefreshCw size={14} />
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DetailContent({ item, tab }: { item: Institution | Formation; tab: Tab }) {
  if (tab === 'institutions') {
    const inst = item as Institution;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <Building2 size={22} className="text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">{inst.name}</div>
            <div className="text-[11px] text-gray-500">{inst.type} • {inst.province}</div>
          </div>
          <div className="ml-auto"><StatusBadge status={inst.status} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <DetailRow label="Directeur" value={inst.director || '—'} />
          <DetailRow label="Email" value={inst.email || '—'} />
          <DetailRow label="Téléphone" value={inst.phone || '—'} />
          <DetailRow label="Adresse" value={inst.address || '—'} />
          <DetailRow label="Ville" value={inst.city || '—'} />
          <DetailRow label="Province" value={inst.province} />
          <DetailRow label="Nombre d'étudiants" value={inst.student_count.toLocaleString()} />
          <DetailRow label="Nombre de formations" value={String(inst.formation_count)} />
          <DetailRow label="Soumise le" value={formatDate(inst.submitted_at)} />
          <DetailRow label="Validée le" value={inst.validated_at ? formatDate(inst.validated_at) : '—'} />
        </div>
        {inst.notes && (
          <div>
            <div className="text-[11px] font-medium text-gray-600 mb-1">Notes</div>
            <div className="text-[12px] text-gray-700 p-3 bg-gray-50 rounded-lg">{inst.notes}</div>
          </div>
        )}
      </div>
    );
  }
  const f = item as Formation;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center">
          <GraduationCap size={22} className="text-violet-600" />
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">{f.name}</div>
          <div className="text-[11px] text-gray-500">{f.institutions?.name || '—'}</div>
        </div>
        <div className="ml-auto"><StatusBadge status={f.status} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <DetailRow label="Institution" value={f.institutions?.name || '—'} />
        <DetailRow label="Filière" value={f.filiere} />
        <DetailRow label="Niveau" value={f.level} />
        <DetailRow label="Durée" value={f.duration || '—'} />
        <DetailRow label="Soumise le" value={formatDate(f.submitted_at)} />
        <DetailRow label="Validée le" value={f.validated_at ? formatDate(f.validated_at) : '—'} />
      </div>
      {f.description && (
        <div>
          <div className="text-[11px] font-medium text-gray-600 mb-1">Description</div>
          <div className="text-[12px] text-gray-700 p-3 bg-gray-50 rounded-lg">{f.description}</div>
        </div>
      )}
      {f.notes && (
        <div>
          <div className="text-[11px] font-medium text-gray-600 mb-1">Notes</div>
          <div className="text-[12px] text-gray-700 p-3 bg-gray-50 rounded-lg">{f.notes}</div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-gray-400 mb-0.5">{label}</div>
      <div className="text-[12px] text-gray-800 font-medium">{value}</div>
    </div>
  );
}

function AddModal({ open, onClose, tab, institutions, onCreated }: {
  open: boolean;
  onClose: () => void;
  tab: Tab;
  institutions: Institution[];
  onCreated: () => void;
}) {
  const [saving, setSaving] = useState(false);

  // Institution form
  const [name, setName] = useState('');
  const [type, setType] = useState('Institut');
  const [province, setProvince] = useState('Bujumbura Mairie');
  const [city, setCity] = useState('');
  const [director, setDirector] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Formation form
  const [fName, setFName] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [filiere, setFiliere] = useState('Sciences');
  const [level, setLevel] = useState('Licence');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');

  const reset = () => {
    setName(''); setType('Institut'); setProvince('Bujumbura Mairie'); setCity('');
    setDirector(''); setEmail(''); setPhone(''); setAddress(''); setNotes('');
    setFName(''); setInstitutionId(''); setFiliere('Sciences'); setLevel('Licence');
    setDuration(''); setDescription('');
  };

  const handleSubmit = async () => {
    setSaving(true);
    if (tab === 'institutions') {
      if (!name.trim()) { setSaving(false); return; }
      const { error } = await supabase.from('institutions').insert({
        name, type, province, city: city || null, director: director || null,
        email: email || null, phone: phone || null, address: address || null,
        notes: notes || null, status: 'en_attente',
      });
      if (!error) { reset(); onClose(); onCreated(); }
    } else {
      if (!fName.trim() || !institutionId) { setSaving(false); return; }
      const { error } = await supabase.from('formations').insert({
        name: fName, institution_id: institutionId, filiere, level,
        duration: duration || null, description: description || null, status: 'en_attente',
      });
      if (!error) { reset(); onClose(); onCreated(); }
    }
    setSaving(false);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={tab === 'institutions' ? 'Nouvelle institution' : 'Nouvelle formation'}
      footer={
        <>
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Annuler</button>
          <button onClick={handleSubmit} disabled={saving} className="px-3 py-1.5 text-[12px] font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
            {saving ? 'Enregistrement...' : 'Soumettre'}
          </button>
        </>
      }
    >
      {tab === 'institutions' ? (
        <div className="space-y-3">
          <Field label="Nom de l'institution *"><Input value={name} onChange={setName} placeholder="Ex: Université du Lac Tanganyika" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type"><Select value={type} onChange={setType} options={INSTITUTION_TYPES.map(t => ({ value: t, label: t }))} /></Field>
            <Field label="Province"><Select value={province} onChange={setProvince} options={PROVINCES.map(p => ({ value: p, label: p }))} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ville"><Input value={city} onChange={setCity} placeholder="Ex: Bujumbura" /></Field>
            <Field label="Directeur"><Input value={director} onChange={setDirector} placeholder="Nom du directeur" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email"><Input value={email} onChange={setEmail} placeholder="contact@institution.bi" /></Field>
            <Field label="Téléphone"><Input value={phone} onChange={setPhone} placeholder="+257 ..." /></Field>
          </div>
          <Field label="Adresse"><Input value={address} onChange={setAddress} placeholder="Adresse complète" /></Field>
          <Field label="Notes"><TextArea value={notes} onChange={setNotes} placeholder="Notes internes..." /></Field>
        </div>
      ) : (
        <div className="space-y-3">
          <Field label="Nom de la formation *"><Input value={fName} onChange={setFName} placeholder="Ex: Licence en Informatique" /></Field>
          <Field label="Institution *">
            <Select
              value={institutionId}
              onChange={setInstitutionId}
              options={institutions.map(i => ({ value: i.id, label: i.name }))}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Filière"><Select value={filiere} onChange={setFiliere} options={FILIERES.map(f => ({ value: f, label: f }))} /></Field>
            <Field label="Niveau"><Select value={level} onChange={setLevel} options={LEVELS.map(l => ({ value: l, label: l }))} /></Field>
          </div>
          <Field label="Durée"><Input value={duration} onChange={setDuration} placeholder="Ex: 3 ans" /></Field>
          <Field label="Description"><TextArea value={description} onChange={setDescription} placeholder="Description de la formation..." /></Field>
        </div>
      )}
    </Modal>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-16 flex flex-col items-center gap-2 text-gray-400">
      <FileText size={32} className="text-gray-300" />
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
