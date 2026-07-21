import { useState } from 'react';
import {
  LayoutDashboard, CheckSquare, PenTool, FileText, BookOpen,
  Building2, GraduationCap, RefreshCw, ShieldAlert, Bell,
  BarChart3, Settings, Users, ChevronDown, RotateCcw,
  type LucideIcon
} from 'lucide-react';

export type PageId =
  | 'dashboard'
  | 'validation'
  | 'signature'
  | 'documentaire';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

const navItems: { icon: LucideIcon; label: string; page?: PageId; hasChildren?: boolean }[] = [
  { icon: LayoutDashboard, label: 'Tableau de bord', page: 'dashboard' },
  { icon: CheckSquare, label: 'Centre de Validation', page: 'validation', hasChildren: true },
  { icon: PenTool, label: 'Centre de Signature', page: 'signature', hasChildren: true },
  { icon: FileText, label: 'Centre Documentaire', page: 'documentaire', hasChildren: true },
  { icon: BookOpen, label: 'Registre National (NSE)', hasChildren: true },
  { icon: Building2, label: 'Institutions & Programmes', hasChildren: true },
  { icon: GraduationCap, label: 'Examens Nationaux', hasChildren: true },
  { icon: RefreshCw, label: 'Synchronisation Nationale', hasChildren: true },
  { icon: ShieldAlert, label: 'Détection de Fraude', hasChildren: true },
  { icon: Bell, label: 'Notifications', hasChildren: true },
  { icon: BarChart3, label: 'Analytics & Rapports', hasChildren: true },
  { icon: Settings, label: 'Paramètres Nationaux', hasChildren: true },
  { icon: Users, label: 'Utilisateurs & Rôles', hasChildren: true },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [academicYear, setAcademicYear] = useState('2024 - 2025');
  const [province, setProvince] = useState('');
  const [institution, setInstitution] = useState('');

  return (
    <aside className="w-[185px] min-w-[185px] bg-[#1a2540] flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="px-3 py-4 border-b border-white/10 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center shrink-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600" />
          <svg viewBox="0 0 36 36" className="w-8 h-8 relative z-10">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#fff" strokeWidth="1.5"/>
            <path d="M18 8 L22 14 L28 12 L24 18 L28 24 L22 22 L18 28 L14 22 L8 24 L12 18 L8 12 L14 14 Z" fill="#fff" opacity="0.9"/>
            <circle cx="18" cy="18" r="4" fill="#fff"/>
          </svg>
        </div>
        <div>
          <div className="text-white font-bold text-sm leading-tight tracking-wide">NOVARIS</div>
          <div className="text-slate-400 text-[9px] leading-tight">République du Burundi</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2">
        {navItems.map(({ icon: Icon, label, page, hasChildren }) => {
          const active = page === currentPage;
          return (
            <button
              key={label}
              onClick={() => page && onNavigate(page)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors group ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={14} className={active ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
              <span className="text-[11px] font-medium flex-1 leading-tight">{label}</span>
              {hasChildren && !active && <ChevronDown size={10} className="text-slate-500 group-hover:text-slate-300" />}
            </button>
          );
        })}
      </nav>

      {/* Filters */}
      <div className="px-3 py-3 border-t border-white/10">
        <div className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-3">Filtres rapides</div>

        <div className="mb-2.5">
          <label className="text-slate-400 text-[9px] font-medium block mb-1">Année académique</label>
          <div className="relative">
            <select
              value={academicYear}
              onChange={e => setAcademicYear(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-slate-300 text-[10px] rounded px-2 py-1.5 appearance-none cursor-pointer focus:outline-none focus:border-blue-500"
            >
              <option value="2024 - 2025">2024 - 2025</option>
              <option value="2023 - 2024">2023 - 2024</option>
            </select>
            <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="mb-2.5">
          <label className="text-slate-400 text-[9px] font-medium block mb-1">Province</label>
          <div className="relative">
            <select
              value={province}
              onChange={e => setProvince(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-slate-300 text-[10px] rounded px-2 py-1.5 appearance-none cursor-pointer focus:outline-none focus:border-blue-500"
            >
              <option value="">Toutes les inovinnes</option>
              <option value="buja">Bujumbura Mairie</option>
              <option value="gitega">Gitega</option>
            </select>
            <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="mb-3">
          <label className="text-slate-400 text-[9px] font-medium block mb-1">Institution</label>
          <div className="relative">
            <select
              value={institution}
              onChange={e => setInstitution(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-slate-300 text-[10px] rounded px-2 py-1.5 appearance-none cursor-pointer focus:outline-none focus:border-blue-500"
            >
              <option value="">Toutes les institutions</option>
            </select>
            <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold py-1.5 rounded transition-colors">
          <RotateCcw size={10} />
          Réinitialiser les Filtres
        </button>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-white/10">
        <div className="text-slate-500 text-[9px]">NOVARIS • 3.1.0</div>
        <div className="text-slate-600 text-[9px]">© 2025 - Tous droits réservés</div>
      </div>
    </aside>
  );
}
