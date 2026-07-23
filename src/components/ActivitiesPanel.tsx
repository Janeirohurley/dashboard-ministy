import { Clock, CheckCircle2, ShieldCheck, QrCode, Building2, AlertCircle } from 'lucide-react';

const activities = [
  {
    icon: ShieldCheck,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    title: 'Nevneau lot de validation samais',
    detail: 'Université de Burundi • DIPL-2025-1125',
    time: 'Il y a 5 min',
  },
  {
    icon: CheckCircle2,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    title: 'Document signé',
    detail: 'Université • NSE-2055-005123',
    time: 'Il y a 15 min',
  },
  {
    icon: QrCode,
    iconBg: 'bg-gray-50',
    iconColor: 'text-gray-600',
    title: 'Vérification publique',
    detail: 'QR scunné dépots Bujumulura',
    time: 'Il y a 30 min',
  },
  {
    icon: AlertCircle,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    title: 'Alerte de fraude défesde',
    detail: 'S.quanne ananale • NSE-2055-000987',
    time: 'Il y a 35 min',
  },
  {
    icon: Building2,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    title: 'Institution accréditée',
    detail: 'ISGE Uivge • Accréditation n° 2023-045',
    time: 'Il y a 1 h',
  },
];

export default function ActivitiesPanel() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Activités récentes</h3>
        <span className="text-[10px] text-blue-600 cursor-pointer hover:underline">Voir tout</span>
      </div>
      <div className="space-y-2">
        {activities.map((a, i) => (
          <div key={i} className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className={`w-7 h-7 rounded-lg ${a.iconBg} flex items-center justify-center shrink-0`}>
              <a.icon size={13} className={a.iconColor} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium text-gray-800 leading-tight">{a.title}</div>
              <div className="text-[10px] text-gray-500 truncate">{a.detail}</div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Clock size={9} className="text-gray-400" />
              <span className="text-[9px] text-gray-400 whitespace-nowrap">{a.time}</span>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-3 w-full border border-gray-200 rounded-lg py-1.5 text-[10px] text-gray-500 hover:bg-gray-50 transition-colors">
        Voir toutes les activités
      </button>
    </div>
  );
}
