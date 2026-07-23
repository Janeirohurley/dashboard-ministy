import { BookOpen, Map, Headphones } from 'lucide-react';

export default function HelpCenter() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Centre d'aide</h3>
      <div className="grid grid-cols-3 gap-3">
        <button className="flex items-center gap-2 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors text-left">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <BookOpen size={13} className="text-blue-600" />
          </div>
          <span className="text-[11px] font-medium text-gray-700">Documentation</span>
        </button>
        <button className="flex items-center gap-2 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors text-left">
          <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <Map size={13} className="text-amber-600" />
          </div>
          <span className="text-[11px] font-medium text-gray-700">Guides</span>
        </button>
        <button className="flex items-center gap-2 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors text-left">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <Headphones size={13} className="text-emerald-600" />
          </div>
          <span className="text-[11px] font-medium text-gray-700">Support technique</span>
        </button>
      </div>
    </div>
  );
}
