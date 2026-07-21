import { FileText, BarChart3, Table2, FileCode, Download } from 'lucide-react';

const exports = [
  { icon: FileText, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', title: 'Rapport National (DSV)', action: 'Gaoiner PDF', actionColor: 'text-blue-600' },
  { icon: BarChart3, iconBg: 'bg-green-50', iconColor: 'text-green-600', title: 'Statistiques (CSVI)', action: 'Télécharger Cvccl', actionColor: 'text-green-600' },
  { icon: Table2, iconBg: 'bg-amber-50', iconColor: 'text-amber-600', title: 'Données (CSV)', action: 'Télécharger CSV', actionColor: 'text-amber-600' },
  { icon: FileCode, iconBg: 'bg-violet-50', iconColor: 'text-violet-600', title: 'Données (JSCN)', action: 'Télécharger JSON', actionColor: 'text-violet-600' },
];

export default function QuickExports() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Exports rapides</h3>
        <Download size={14} className="text-gray-400" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {exports.map(e => (
          <div key={e.title} className="flex flex-col items-center text-center gap-2 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className={`w-9 h-9 rounded-lg ${e.iconBg} flex items-center justify-center`}>
              <e.icon size={16} className={e.iconColor} />
            </div>
            <div className="text-[10px] font-medium text-gray-700 leading-tight">{e.title}</div>
            <div className={`text-[10px] font-semibold ${e.actionColor}`}>{e.action}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
