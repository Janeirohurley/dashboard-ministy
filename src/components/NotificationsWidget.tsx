import { AlertTriangle, Info, CheckCircle2, RefreshCw } from 'lucide-react';

const notifications = [
  {
    icon: AlertTriangle,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    title: 'Campagne de vérification des diplomas',
    date: '30 Nov. 2025',
  },
  {
    icon: Info,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    title: "Mise à jour des procédures d'accréditation",
    date: '28 Nov. 2025',
  },
  {
    icon: CheckCircle2,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    title: 'Rapport transester - Q4 2025',
    date: '25 Nov. 2025',
  },
  {
    icon: RefreshCw,
    iconBg: 'bg-gray-50',
    iconColor: 'text-gray-500',
    title: 'Maintenance système prénce',
    date: '20 Nov. 2025',
  },
  {
    icon: AlertTriangle,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    title: 'Nouveau guide des institutions',
    date: '18 Nov. 2025',
  },
];

export default function NotificationsWidget() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Notifications nationales</h3>
        <span className="text-[10px] text-blue-600 cursor-pointer hover:underline">Voir tout</span>
      </div>
      <div className="space-y-2">
        {notifications.map((n, i) => (
          <div key={i} className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className={`w-7 h-7 rounded-lg ${n.iconBg} flex items-center justify-center shrink-0`}>
              <n.icon size={13} className={n.iconColor} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium text-gray-800 leading-tight">{n.title}</div>
            </div>
            <span className="text-[9px] text-gray-400 shrink-0 whitespace-nowrap">{n.date}</span>
          </div>
        ))}
      </div>
      <button className="mt-3 w-full border border-gray-200 rounded-lg py-1.5 text-[10px] text-gray-500 hover:bg-gray-50 transition-colors">
        Voir toutes les notifications
      </button>
    </div>
  );
}
