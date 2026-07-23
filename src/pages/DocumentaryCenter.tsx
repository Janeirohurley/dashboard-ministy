import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { DocumentItem, DocumentStatus } from '@/types';
import { STATUS_LABELS } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import Modal, { Field, Input, Select, TextArea } from '@/components/Modal';
import {
  Search, Plus, FileText, Eye, ChevronRight, Download, Trash2,
  FolderOpen, File, FileCheck, Archive, Clock, Filter, Grid3x3, List,
  type LucideIcon
} from 'lucide-react';

const DOC_TYPES = ['Diplôme', 'Certificat', 'Relevé de Notes', 'Attestation', 'Convocation', 'Décision'];

export default function DocumentaryCenter() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [institutions, setInstitutions] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<DocumentItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

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
    const matchesType = typeFilter === 'all' || d.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce document ? Cette action est irréversible.')) return;
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (!error) { await loadData(); setDetailOpen(false); }
  };

  // Group by type for folder view
  const folders = DOC_TYPES.map(type => ({
    type,
    count: documents.filter(d => d.type === type).length,
    Icon: getDocIconComponent(type),
  })).filter(f => f.count > 0);

  return (
    <div className="px-5 pb-6">
      <div className="py-4">
        <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-1">
          <span>NOVARIS</span><ChevronRight size={11} /><span>Centre Documentaire</span>
        </div>
        <h2 className="text-base font-bold text-gray-900">Centre Documentaire</h2>
        <p className="text-[11px] text-gray-500">
          Archive centralisée des documents officiels - diplômes, certificats, relevés et décisions.
        </p>
      </div>

      {/* Folders */}
      <div className="mb-4">
        <div className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-2">Dossiers par type</div>
        <div className="grid grid-cols-6 gap-3">
          {folders.map(folder => (
            <button
              key={folder.type}
              onClick={() => setTypeFilter(folder.type)}
              className={`bg-white rounded-xl border p-3 flex flex-col items-center gap-2 transition-all hover:shadow-sm ${
                typeFilter === folder.type ? 'border-blue-400 ring-1 ring-blue-100' : 'border-gray-100'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <folder.Icon size={18} className="text-blue-600" />
              </div>
              <div className="text-[11px] font-medium text-gray-700 text-center leading-tight">{folder.type}</div>
              <div className="text-[10px] text-gray-400">{folder.count} doc{folder.count > 1 ? 's' : ''}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher dans les documents..."
            className="w-full pl-9 pr-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors"
          />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white cursor-pointer">
          <option value="all">Tous les types</option>
          {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white cursor-pointer">
          <option value="all">Tous les statuts</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          <button onClick={() => setView('grid')} className={`w-8 h-8 flex items-center justify-center transition-colors ${view === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'}`}>
            <Grid3x3 size={14} />
          </button>
          <button onClick={() => setView('list')} className={`w-8 h-8 flex items-center justify-center transition-colors ${view === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'}`}>
            <List size={14} />
          </button>
        </div>
        <button onClick={() => setAddOpen(true)} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-medium px-3 py-2 rounded-lg transition-colors shrink-0">
          <Plus size={14} /> Ajouter
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-gray-400 text-[12px]">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 py-16 flex flex-col items-center gap-2 text-gray-400">
          <Archive size={32} className="text-gray-300" />
          <div className="text-[12px]">Aucun document trouvé</div>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-4 gap-3">
          {filtered.map(doc => (
            <div key={doc.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow cursor-pointer group" onClick={() => { setSelected(doc); setDetailOpen(true); }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  {getDocIcon(doc.type, 18, 'text-blue-600')}
                </div>
                <StatusBadge status={doc.status} />
              </div>
              <div className="text-[12px] font-medium text-gray-900 mb-1 truncate">{doc.title}</div>
              <div className="text-[10px] text-gray-400 font-mono mb-2">{doc.reference}</div>
              <div className="flex items-center justify-between text-[10px] text-gray-500">
                <span>{doc.type}</span>
                {doc.signed && <span className="text-violet-600 font-medium">Signé</span>}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">{formatDate(doc.created_at)}</span>
                <Eye size={13} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <Th>Document</Th><Th>Référence</Th><Th>Type</Th><Th>Étudiant</Th><Th>Institution</Th><Th>Statut</Th><Th>Date</Th><Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(doc => (
                <tr key={doc.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => { setSelected(doc); setDetailOpen(true); }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        {getDocIcon(doc.type, 14, 'text-blue-600')}
                      </div>
                      <div className="text-[12px] font-medium text-gray-900 truncate max-w-[200px]">{doc.title}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-gray-600 font-mono">{doc.reference}</td>
                  <td className="px-4 py-3 text-[11px] text-gray-600">{doc.type}</td>
                  <td className="px-4 py-3 text-[11px] text-gray-600">{doc.student_name || '—'}</td>
                  <td className="px-4 py-3 text-[11px] text-gray-600 truncate max-w-[150px]">{doc.institutions?.name || '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={doc.status} /></td>
                  <td className="px-4 py-3 text-[10px] text-gray-400">{formatDate(doc.created_at)}</td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setSelected(doc); setDetailOpen(true); }} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Voir">
                        <Eye size={14} />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors" title="Télécharger">
                        <Download size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Détails du document"
        footer={
          selected && (
            <>
              <button onClick={() => handleDelete(selected.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 size={14} /> Supprimer
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <Download size={14} /> Télécharger
              </button>
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                {getDocIcon(selected.type, 22, 'text-blue-600')}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{selected.title}</div>
                <div className="text-[11px] text-gray-500 font-mono">{selected.reference}</div>
              </div>
              <div className="ml-auto"><StatusBadge status={selected.status} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <DetailRow label="Type" value={selected.type} />
              <DetailRow label="Référence" value={selected.reference} />
              <DetailRow label="Étudiant" value={selected.student_name || '—'} />
              <DetailRow label="Institution" value={selected.institutions?.name || '—'} />
              <DetailRow label="Statut" value={STATUS_LABELS[selected.status]} />
              <DetailRow label="Signé" value={selected.signed ? `Oui, par ${selected.signed_by}` : 'Non'} />
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
    if (!title.trim() || !reference.trim()) return;
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
      title="Ajouter un document"
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

function getDocIconComponent(type: string): LucideIcon {
  switch (type) {
    case 'Diplôme': return FileCheck;
    case 'Certificat': return FileCheck;
    case 'Relevé de Notes': return FileText;
    case 'Attestation': return File;
    case 'Convocation': return FileText;
    case 'Décision': return Archive;
    default: return FileText;
  }
}

function getDocIcon(type: string, size: number = 18, className: string = 'text-blue-600'): React.ReactNode {
  const Icon = getDocIconComponent(type);
  return <Icon size={size} className={className} />;
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
