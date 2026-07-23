import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Institution, InstitutionStatus } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import Modal, { Field, Input, Select, TextArea } from '@/components/Modal';
import {
  Search, Plus, Building2, Users, GraduationCap, FileText, Award,
  ChevronRight, MapPin, Mail, Clock, CheckCircle2, RefreshCw, Eye
} from 'lucide-react';

const INSTITUTION_TYPES = ['Université', 'Institut', 'École', 'Centre de formation'];
const PROVINCES = ['Bujumbura Mairie', 'Gitega', 'Ngozi', 'Bujumbura Rural', 'Bururi', 'Muyinga'];

export default function InstitutionsList({ onOpenInstitution }: { onOpenInstitution: (id: string) => void }) {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [addOpen, setAddOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('institutions')
      .select('*')
      .order('name', { ascending: true });
    if (!error && data) setInstitutions(data as Institution[]);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = institutions.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
      (i.director || '').toLowerCase().includes(search.toLowerCase()) ||
      (i.city || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    const matchesType = typeFilter === 'all' || i.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="px-5 pb-6">
      <div className="py-4">
        <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-1">
          <span>NOVARIS</span><ChevronRight size={11} /><span>Institutions</span>
        </div>
        <h2 className="text-base font-bold text-gray-900">Institutions</h2>
        <p className="text-[11px] text-gray-500">
          Cliquez sur une institution pour ouvrir sa fiche complète — étudiants, formations, documents, signatures et plus.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une institution, un directeur, une ville..."
            className="w-full pl-9 pr-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors"
          />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white cursor-pointer">
          <option value="all">Tous les types</option>
          {INSTITUTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white cursor-pointer">
          <option value="all">Tous les statuts</option>
          <option value="approuve">Approuvé</option>
          <option value="en_revision">En révision</option>
          <option value="en_attente">En attente</option>
          <option value="rejete">Rejeté</option>
        </select>
        <button onClick={() => setAddOpen(true)} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-medium px-3 py-2 rounded-lg transition-colors shrink-0">
          <Plus size={14} /> Nouvelle Institution
        </button>
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-gray-400 text-[12px]">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 py-16 flex flex-col items-center gap-2 text-gray-400">
          <Building2 size={32} className="text-gray-300" />
          <div className="text-[12px]">Aucune institution trouvée</div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {filtered.map(inst => (
            <div
              key={inst.id}
              onClick={() => onOpenInstitution(inst.id)}
              className="bg-white rounded-xl border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Building2 size={20} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-gray-900 leading-tight truncate">{inst.name}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{inst.type}</div>
                </div>
                <StatusBadge status={inst.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <InfoCell icon={<MapPin size={11} />} value={inst.province} />
                <InfoCell icon={<Users size={11} />} value={`${inst.student_count.toLocaleString()} étudiants`} />
                <InfoCell icon={<GraduationCap size={11} />} value={`${inst.formation_count} formations`} />
                <InfoCell icon={<Award size={11} />} value={`${inst.accreditation_count} accréd.`} />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <div className="flex items-center gap-1.5">
                  <Clock size={11} className="text-gray-400" />
                  <span className="text-[10px] text-gray-500">{inst.last_sync_at ? `Sync ${formatDate(inst.last_sync_at)}` : 'Jamais synchronisé'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${inst.sync_percentage >= 80 ? 'bg-emerald-500' : inst.sync_percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${inst.sync_percentage}%` }} />
                  </div>
                  <span className="text-[10px] font-medium text-gray-600">{inst.sync_percentage}%</span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-end">
                <span className="text-[10px] text-blue-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Ouvrir la fiche <ChevronRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddInstitutionModal open={addOpen} onClose={() => setAddOpen(false)} onCreated={loadData} />
    </div>
  );
}

function InfoCell({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
      <span className="text-gray-400">{icon}</span>
      <span className="truncate">{value}</span>
    </div>
  );
}

function AddInstitutionModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('Institut');
  const [province, setProvince] = useState('Bujumbura Mairie');
  const [city, setCity] = useState('');
  const [director, setDirector] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [notes, setNotes] = useState('');

  const reset = () => { setName(''); setType('Institut'); setProvince('Bujumbura Mairie'); setCity(''); setDirector(''); setEmail(''); setPhone(''); setAddress(''); setAdminName(''); setAdminEmail(''); setNotes(''); };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('institutions').insert({
      name, type, province, city: city || null, director: director || null,
      email: email || null, phone: phone || null, address: address || null,
      admin_name: adminName || null, admin_email: adminEmail || null,
      notes: notes || null, status: 'en_attente',
    });
    if (!error) { reset(); onClose(); onCreated(); }
    setSaving(false);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nouvelle institution"
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
        <div className="grid grid-cols-2 gap-3">
          <Field label="Administrateur"><Input value={adminName} onChange={setAdminName} placeholder="Nom de l'admin" /></Field>
          <Field label="Email admin"><Input value={adminEmail} onChange={setAdminEmail} placeholder="admin@institution.bi" /></Field>
        </div>
        <Field label="Notes"><TextArea value={notes} onChange={setNotes} placeholder="Notes internes..." /></Field>
      </div>
    </Modal>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}
