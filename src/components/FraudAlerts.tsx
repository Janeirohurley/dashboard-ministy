import { AlertTriangle, Clock } from 'lucide-react';

const alerts = [
  {
    title: 'Tentative de falsification de diplôme',
    institution: 'Université du Lac Tanganyika',
    time: 'Il y a 2 heures',
    severity: 'high',
    badge: 'Critique',
  },
  {
    title: 'Document signé avec signature invalide',
    institution: 'Institut Polytechnique de Gitega',
    code: 'DOSS-2024-0256',
    time: 'Il y a 5 heures',
    severity: 'medium',
    badge: 'Élevée',
  },
  {
    title: 'QR code utilisé hors système',
    institution: 'Institution Hôte - Burundi',
    time: 'Hier',
    severity: 'medium',
    badge: 'Moyenne',
  },
];

export default function FraudAlerts() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className="text-red-500" />
          <h3 className="text-sm font-semibold text-gray-800">Alertes de fraude récentes</h3>
        </div>
        <span className="text-[10px] text-blue-600 cursor-pointer hover:underline">Voir tout</span>
      </div>
      <div className="space-y-2">
        {alerts.map((alert, i) => (
          <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              alert.severity === 'high' ? 'bg-red-50' : 'bg-amber-50'
            }`}>
              <AlertTriangle size={13} className={alert.severity === 'high' ? 'text-red-500' : 'text-amber-500'} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-medium text-gray-800 truncate">{alert.title}</span>
                <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                  alert.severity === 'high' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {alert.badge}
                </span>
              </div>
              <div className="text-[10px] text-gray-500 truncate">{alert.institution}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <Clock size={9} className="text-gray-400" />
                <span className="text-[9px] text-gray-400">{alert.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
