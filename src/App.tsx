import { useState } from 'react';
import Sidebar, { type PageId } from '@/components/Sidebar';
import Header from '@/components/Header';
import StatCards from '@/components/StatCards';
import ValidationChart from '@/components/ValidationChart';
import WorkflowChart from '@/components/WorkflowChart';
import SyncChart from '@/components/SyncChart';
import ActivitiesPanel from '@/components/ActivitiesPanel';
import ProvinceMap from '@/components/ProvinceMap';
import ExamsWidget from '@/components/ExamsWidget';
import FraudChart from '@/components/FraudChart';
import NotificationsWidget from '@/components/NotificationsWidget';
import QuickExports from '@/components/QuickExports';
import HelpCenter from '@/components/HelpCenter';
import ValidationCenter from '@/pages/ValidationCenter';
import SignatureCenter from '@/pages/SignatureCenter';
import InstitutionsList from '@/pages/InstitutionsList';
import InstitutionDetail from '@/pages/InstitutionDetail';
import RegistreNational from '@/pages/RegistreNational';
import { RefreshCw } from 'lucide-react';

export default function App() {
  const [page, setPage] = useState<PageId>('dashboard');
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string | null>(null);

  const openInstitution = (id: string) => {
    setSelectedInstitutionId(id);
    setPage('institutions');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar currentPage={page} onNavigate={setPage} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {page === 'dashboard' && <Dashboard onNavigate={setPage} onOpenInstitution={openInstitution} />}
          {page === 'institutions' && (
            selectedInstitutionId
              ? <InstitutionDetail institutionId={selectedInstitutionId} onBack={() => setSelectedInstitutionId(null)} />
              : <InstitutionsList onOpenInstitution={openInstitution} />
          )}
          {page === 'registre' && <RegistreNational onOpenInstitution={openInstitution} />}
          {page === 'validation' && <ValidationCenter />}
          {page === 'signature' && <SignatureCenter />}
        </main>
      </div>
    </div>
  );
}

function Dashboard({ onNavigate, onOpenInstitution }: { onNavigate: (page: PageId) => void; onOpenInstitution: (id: string) => void }) {
  return (
    <div className="px-5 pb-6">
      <div className="flex items-center justify-between py-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">Tableau de bord National</h2>
          <p className="text-[11px] text-gray-500">Vue d'ensemble en temps réel du système éducatif national</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-500">Dernière mise à jour : 30 Nov. 2025 14:35:42</span>
          <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium px-3 py-1.5 rounded-lg transition-colors">
            <RefreshCw size={12} />
            Actualiser
          </button>
        </div>
      </div>

      <StatCards />

      <div className="grid grid-cols-[1fr_1fr_1fr_280px] gap-3 mt-4">
        <ValidationChart />
        <WorkflowChart />
        <SyncChart />
        <ActivitiesPanel />
      </div>

      <div className="grid grid-cols-[1fr_1fr_1fr_280px] gap-3 mt-4">
        <ProvinceMap />
        <ExamsWidget />
        <FraudChart />
        <NotificationsWidget />
      </div>

      <div className="grid grid-cols-[1fr_360px] gap-3 mt-4">
        <QuickExports />
        <HelpCenter />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <button onClick={() => onNavigate('institutions')} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-sm transition-all text-left group">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" /></svg>
          </div>
          <div className="flex-1">
            <div className="text-[12px] font-semibold text-gray-900">Institutions</div>
            <div className="text-[10px] text-gray-500">Fiches institutionnelles détaillées</div>
          </div>
          <ChevronRightIcon />
        </button>
        <button onClick={() => onNavigate('registre')} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-sm transition-all text-left group">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teal-600"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </div>
          <div className="flex-1">
            <div className="text-[12px] font-semibold text-gray-900">Registre National</div>
            <div className="text-[10px] text-gray-500">Recherche globale (NSE, documents)</div>
          </div>
          <ChevronRightIcon />
        </button>
        <button onClick={() => onNavigate('validation')} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-sm transition-all text-left group">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
          </div>
          <div className="flex-1">
            <div className="text-[12px] font-semibold text-gray-900">Validation Ministérielle</div>
            <div className="text-[10px] text-gray-500">Lots nationaux en attente</div>
          </div>
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}

function ChevronRightIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 group-hover:text-gray-500 transition-colors"><polyline points="9 18 15 12 9 6" /></svg>;
}
