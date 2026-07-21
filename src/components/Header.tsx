import { Bell, Download, Search, ChevronDown, RefreshCw, Globe } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-5 py-2.5 flex items-center gap-4 sticky top-0 z-30">
      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-bold text-gray-900 leading-tight">Dashboard National</h1>
        <p className="text-[10px] text-gray-500 leading-tight">Ministère de l'Éducation Nationale et de la Recherche Scientifique</p>
      </div>

      {/* Search */}
      <div className="relative w-56">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Recherche globale..."
          className="w-full pl-8 pr-14 py-1.5 text-[11px] border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono">Ctrl+K</span>
      </div>

      {/* Export */}
      <button className="flex items-center gap-1.5 text-[11px] font-medium text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
        <Download size={13} />
        Exporter
        <ChevronDown size={11} />
      </button>

      {/* Notifications */}
      <div className="flex items-center gap-2">
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={15} className="text-gray-600" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">9</span>
        </button>
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={15} className="text-gray-600" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">12</span>
        </button>
      </div>

      {/* Language */}
      <button className="flex items-center gap-1 text-[11px] font-medium text-gray-700 hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors">
        <Globe size={13} />
        FR
        <ChevronDown size={11} />
      </button>

      {/* User */}
      <button className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">JN</div>
        <div className="text-left">
          <div className="text-[11px] font-semibold text-gray-800 leading-tight">Dr. Jean NDUWIMANA</div>
          <div className="text-[9px] text-gray-500 leading-tight">Ministre</div>
        </div>
        <ChevronDown size={11} className="text-gray-400" />
      </button>
    </header>
  );
}
