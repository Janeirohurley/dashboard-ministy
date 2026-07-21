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
import DocumentaryCenter from '@/pages/DocumentaryCenter';
import { RefreshCw } from 'lucide-react';

export default function App() {
  const [page, setPage] = useState<PageId>('dashboard');

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar currentPage={page} onNavigate={setPage} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {page === 'dashboard' && <Dashboard onNavigate={setPage} />}
          {page === 'validation' && <ValidationCenter />}
          {page === 'signature' && <SignatureCenter />}
          {page === 'documentaire' && <DocumentaryCenter />}
        </main>
      </div>
    </div>
  );
}

function Dashboard({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return (
    <div className="px-5 pb-6">
      {/* Page title + last updated */}
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

      {/* Stat cards */}
      <StatCards />

      {/* Row 2: Validation, Workflow, Sync, Activities */}
      <div className="grid grid-cols-[1fr_1fr_1fr_280px] gap-3 mt-4">
        <ValidationChart />
        <WorkflowChart />
        <SyncChart />
        <ActivitiesPanel />
      </div>

      {/* Row 3: Map, Exams, Fraud, Notifications */}
      <div className="grid grid-cols-[1fr_1fr_1fr_280px] gap-3 mt-4">
        <ProvinceMap />
        <ExamsWidget />
        <FraudChart />
        <NotificationsWidget />
      </div>

      {/* Row 4: Exports + Help */}
      <div className="grid grid-cols-[1fr_360px] gap-3 mt-4">
        <QuickExports />
        <HelpCenter />
      </div>

      {/* Quick links to centers */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <button onClick={() => onNavigate('validation')} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-sm transition-all text-left group">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><CheckSquareIcon /></div>
          <div className="flex-1">
            <div className="text-[12px] font-semibold text-gray-900">Centre de Validation</div>
            <div className="text-[10px] text-gray-500">Valider institutions & formations</div>
          </div>
          <ChevronRightIcon />
        </button>
        <button onClick={() => onNavigate('signature')} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-sm transition-all text-left group">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center"><PenToolIcon /></div>
          <div className="flex-1">
            <div className="text-[12px] font-semibold text-gray-900">Centre de Signature</div>
            <div className="text-[10px] text-gray-500">Signer documents officiels</div>
          </div>
          <ChevronRightIcon />
        </button>
        <button onClick={() => onNavigate('documentaire')} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-sm transition-all text-left group">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><FileTextIcon /></div>
          <div className="flex-1">
            <div className="text-[12px] font-semibold text-gray-900">Centre Documentaire</div>
            <div className="text-[10px] text-gray-500">Archives des documents</div>
          </div>
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}

function CheckSquareIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>;
}
function PenToolIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-600"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></svg>;
}
function FileTextIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>;
}
function ChevronRightIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 group-hover:text-gray-500 transition-colors"><polyline points="9 18 15 12 9 6" /></svg>;
}
