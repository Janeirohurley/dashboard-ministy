import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

const logs = [
  { icon: CheckCircle2, color: 'text-emerald-500', title: 'Validation approuvée', detail: 'Université du Lac Tanganyika • 124 étudiants', time: '10:23' },
  { icon: AlertCircle, color: 'text-amber-500', title: 'En attente de signature', detail: 'Institut Polytechnique de Gitega • 89 étudiants', time: '10:18' },
  { icon: XCircle, color: 'text-red-500', title: 'Rejet de validation', detail: 'Documentation incomplète • 12 étudiants', time: '09:52' },
  { icon: Clock, color: 'text-blue-500', title: 'Synchronisation en cours', detail: 'Noyau National NOVARIS • 1,245 records', time: '09:45' },
];

export default function ActivityFeed() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Activité récente</h3>
        <span className="text-[10px] text-blue-600 cursor-pointer hover:underline">Voir tout</span>
      </div>
      <div className="space-y-3">
        {logs.map((log, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <log.icon size={15} className={`${log.color} shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium text-gray-800">{log.title}</div>
              <div className="text-[10px] text-gray-500 truncate">{log.detail}</div>
            </div>
            <span className="text-[9px] text-gray-400 shrink-0">{log.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
