import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { DocumentItem, DocumentStatus } from '@/types';
import { STATUS_LABELS } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import Modal, { Field, Input, Select, TextArea } from '@/components/Modal';
import {
  Search, Plus, PenTool, FileText, Eye, ChevronRight, ChevronLeft,
  Check, RefreshCw, Download, Send, Stamp, Clock, CheckCircle2, AlertCircle
} from 'lucide-react';

const DOC_TYPES = ['Diplôme', 'Certificat', 'Relevé de Notes', 'Attestation', 'Convocation', 'Décision'];
const STATUSES: DocumentStatus[] = ['brouillon', 'soumis', 'en_revision', 'approuve', 'signe', 'complete', 'rejete'];

export default function SignatureCenter() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [institutions, setInstitutions] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selected, setSelected] = useState<DocumentItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('documents')
      .select('*, institutions(*), formations(*)')
      .order('created_at', { ascending: false });
    if (!error && data) setDocuments(data as DocumentItem[]);

    const { data: instData } = await supabase.from('institutions').select('id, name').order('name');
    if (instData) setInstitutions(instData);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = documents.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.reference.toLowerCase().includes(search.toLowerCase()) ||
      (d.student_name || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchesType = typeFilter === 'all' || d.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAction = async (id: string, status: DocumentStatus) => {
    setActionLoading(true);
    const update: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (status === 'signe') {
      update.signed = true;
      update.signed_at = new Date().toISOString();
      update.signed_by = 'Dr. Jean NDUWIMANA';
    } else if (status === 'brouillon') {
      update.signed = false;
      update.signed_at = null;
      update.signed_by = null;
    }
    const { error } = await supabase.from('documents').update(update).eq('id', id);
    if (!error) {
      await loadData();
      setDetailOpen(false);
    }
    setActionLoading(false);
  };

  const stats = {
    brouillon: documents.filter(d => d.status === 'brouillon').length,
    enAttente: documents.filter(d => d.status === 'soumis' || d.status === 'en_revision' || d.status === 'approuve').length,
    signe: documents.filter(d => d.status === 'signe').length,
    complete: documents.filter(d => d.status === 'complete').length,
  };

  return (
    <div className="px-5 pb-6">
      <div className="py-4">
        <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-1">
          <span>NOVARIS</span><ChevronRight size={11} /><span>Centre de Signature</span>
        </div>
        <h2 className="text-base font-bold text-gray-900">Centre de Signature</h2>
        <p className="text-[11px] text-gray-500">
          Signature des documents officiels par le ministère - diplômes, certificats, attestations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <StatPill icon={<FileText size={14} className="text-gray-600" />} bg="bg-gray-100" label="Brouillons" value={stats.brouillon} />
        <StatPill icon={<Clock size={14} className="text-amber-600" />} bg="bg-amber-50" label="En attente de signature" value={stats.enAttente} />
        <StatPill icon={<PenTool size={14} className="text-violet-600" />} bg="bg-violet-50" label="Signés" value={stats.signe} />
        <StatPill icon={<CheckCircle2 size={14} className="text-emerald-600" />} bg="bg-emerald-50" label="Complétés" value={stats.complete} />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par titre, référence, étudiant..."
            className="w-full pl-9 pr-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors"
          />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white cursor-pointer">
          <option value="all">Tous les types</option>
          {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white cursor-pointer">
          <option value="all">Tous les statuts</option>
          {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <button onClick={() => setAddOpen(true)} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-medium px-3 py-2 rounded-lg transition-colors shrink-0">
          <Plus size={14} /> Nouveau Document
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-[12px]">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-2 text-gray-400">
            <FileText size={32} className="text-gray-300" />
            <div className="text-[12px]">Aucun document trouvé</div>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <Th>Document</Th>
                <Th>Référence</Th>
                <Th>Type</Th>
                <Th>Étudiant</Th>
                <Th>Institution</Th>
                <Th>Statut</Th>
                <Th>Signature</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(doc => (
                <tr key={doc.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                        <FileText size={14} className="text-violet-600" />
                      </div>
                      <div className="min-w-0 max-w-[200px]">
                        <div className="text-[12px] font-medium text-gray-900 truncate">{doc.title}</div>
                        <div className="text-[10px] text-gray-400">Créé le {formatDate(doc.created_at)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-gray-600 font-mono">{doc.reference}</td>
                  <td className="px-4 py-3 text-[11px] text-gray-600">{doc.type}</td>
                  <td className="px-4 py-3 text-[11px] text-gray-600">{doc.student_name || '—'}</td>
                  <td className="px-4 py-3 text-[11px] text-gray-600 truncate max-w-[160px]">{doc.institutions?.name || '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={doc.status} /></td>
                  <td className="px-4 py-3">
                    {doc.signed ? (
                      <div className="flex items-center gap-1.5">
                        <Stamp size={13} className="text-violet-600" />
                        <span className="text-[10px] text-violet-600 font-medium">{formatDate(doc.signed_at!)}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-400">Non signé</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setSelected(doc); setDetailOpen(true); }} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Voir détails">
                        <Eye size={14} />
                      </button>
                      {!doc.signed && doc.status !== 'rejete' && (
                        <button onClick={() => handleAction(doc.id, 'signe')} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors text-[10px] font-medium" title="Signer">
                          <PenTool size={12} /> Signer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Détails du document"
        footer={
          selected && (
            <div className="flex items-center gap-2">
              {!selected.signed ? (
                <>
                  <button onClick={() => handleAction(selected.id, 'rejete')} disabled={actionLoading} className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50">
                    <AlertCircle size={14} /> Rejeter
                  </button>
                  <button onClick={() => handleAction(selected.id, 'soumis')} disabled={actionLoading} className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50">
                    <Send size={14} /> Soumettre
                  </button>
                  <button onClick={() => handleAction(selected.id, 'signe')} disabled={actionLoading} className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50">
                    <PenTool size={14} /> Signer
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => handleAction(selected.id, 'complete')} disabled={actionLoading} className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50">
                    <CheckCircle2 size={14} /> Marquer complété
                  </button>
                  <button onClick={() => handleAction(selected.id, 'brouillon')} disabled={actionLoading} className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
                    <RefreshCw size={14} /> Annuler signature
                  </button>
                </>
              )}
            </div>
          )
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center">
                <FileText size={22} className="text-violet-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{selected.title}</div>
                <div className="text-[11px] text-gray-500 font-mono">{selected.reference}</div>
              </div>
              <div className="ml-auto"><StatusBadge status={selected.status} /></div>
            </div>
            {selected.signed && (
              <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-lg border border-violet-100">
                <Stamp size={20} className="text-violet-600" />
                <div>
                  <div className="text-[12px] font-medium text-violet-900">Document signé</div>
                  <div className="text-[11px] text-violet-700">Par {selected.signed_by} le {formatDate(selected.signed_at!)}</div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <DetailRow label="Type" value={selected.type} />
              <DetailRow label="Référence" value={selected.reference} />
              <DetailRow label="Étudiant" value={selected.student_name || '—'} />
              <DetailRow label="Institution" value={selected.institutions?.name || '—'} />
              <DetailRow label="Statut" value={STATUS_LABELS[selected.status]} />
              <DetailRow label="Signé" value={selected.signed ? 'Oui' : 'Non'} />
              <DetailRow label="Créé le" value={formatDate(selected.created_at)} />
              <DetailRow label="Signé le" value={selected.signed_at ? formatDate(selected.signed_at) : '—'} />
            </div>
            {selected.notes && (
              <div>
                <div className="text-[11px] font-medium text-gray-600 mb-1">Notes</div>
                <div className="text-[12px] text-gray-700 p-3 bg-gray-50 rounded-lg">{selected.notes}</div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Add Modal */}
      <AddDocModal open={addOpen} onClose={() => setAddOpen(false)} institutions={institutions} onCreated={loadData} />
    </div>
  );
}

function AddDocModal({ open, onClose, institutions, onCreated }: {
  open: boolean; onClose: () => void;
  institutions: { id: string; name: string }[];
  onCreated: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Diplôme');
  const [reference, setReference] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [notes, setNotes] = useState('');

  const reset = () => { setTitle(''); setType('Diplôme'); setReference(''); setInstitutionId(''); setStudentName(''); setNotes(''); };

  const handleSubmit = async () => {
    if (!title.trim() || !reference.trim()) { return; }
    setSaving(true);
    const { error } = await supabase.from('documents').insert({
      title, type, reference, institution_id: institutionId || null,
      student_name: studentName || null, notes: notes || null, status: 'brouillon',
    });
    if (!error) { reset(); onClose(); onCreated(); }
    setSaving(false);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nouveau document"
      footer={
        <>
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Annuler</button>
          <button onClick={handleSubmit} disabled={saving} className="px-3 py-1.5 text-[12px] font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
            {saving ? 'Enregistrement...' : 'Créer'}
          </button>
        </>
      }
    >
      <div className="space-y-3">
        <Field label="Titre du document *"><Input value={title} onChange={setTitle} placeholder="Ex: Diplôme de Licence" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Type"><Select value={type} onChange={setType} options={DOC_TYPES.map(t => ({ value: t, label: t }))} /></Field>
          <Field label="Référence *"><Input value={reference} onChange={setReference} placeholder="DIP-2025-XXXXXX" /></Field>
        </div>
        <Field label="Institution"><Select value={institutionId} onChange={setInstitutionId} options={[{ value: '', label: '— Aucune —' }, ...institutions.map(i => ({ value: i.id, label: i.name }))]} /></Field>
        <Field label="Nom de l'étudiant"><Input value={studentName} onChange={setStudentName} placeholder="Nom complet" /></Field>
        <Field label="Notes"><TextArea value={notes} onChange={setNotes} placeholder="Notes..." /></Field>
      </div>
    </Modal>
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-gray-400 mb-0.5">{label}</div>
      <div className="text-[12px] text-gray-800 font-medium">{value}</div>
    </div>
  );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider ${className}`}>{children}</th>;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}
