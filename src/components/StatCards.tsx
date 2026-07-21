import { ArrowUpRight, Building2, Users, BookOpen, FileText, Award, QrCode, ShieldAlert, ChevronRight } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string | number;
  sub: string;
  subValue: string | number;
  change: number;
  changeLabel?: string;
}

function StatCard({ icon, iconBg, label, value, sub, subValue, change }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-start gap-3 hover:shadow-sm transition-shadow cursor-pointer group min-w-0">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <span className="text-[10px] font-medium text-gray-500 leading-tight">{label}</span>
          <ChevronRight size={12} className="text-gray-300 group-hover:text-gray-400 transition-colors mt-0.5 shrink-0" />
        </div>
        <div className="text-xl font-bold text-gray-900 leading-tight mt-0.5">{value}</div>
        <div className="text-[10px] text-gray-400 mt-0.5">{sub} : {subValue}</div>
        <div className="flex items-center gap-1 mt-1">
          <ArrowUpRight size={10} className="text-emerald-500" />
          <span className="text-[10px] font-semibold text-emerald-500">{change}%</span>
        </div>
      </div>
    </div>
  );
}

export default function StatCards() {
  const stats = [
    {
      icon: <Building2 size={18} className="text-blue-600" />,
      iconBg: 'bg-blue-50',
      label: 'Institutions',
      value: 30,
      sub: 'Actives',
      subValue: 22,
      change: 4,
    },
    {
      icon: <Users size={18} className="text-teal-600" />,
      iconBg: 'bg-teal-50',
      label: 'Étudiants (NSE)',
      value: '128,456',
      sub: 'Inscrits cette année',
      subValue: '',
      change: 8.2,
    },
    {
      icon: <BookOpen size={18} className="text-violet-600" />,
      iconBg: 'bg-violet-50',
      label: 'Formations',
      value: 200,
      sub: 'Approuvées',
      subValue: 156,
      change: 6,
    },
    {
      icon: <FileText size={18} className="text-amber-600" />,
      iconBg: 'bg-amber-50',
      label: 'Documents Officiels',
      value: 300,
      sub: 'Signés',
      subValue: 250,
      change: 12,
    },
    {
      icon: <Award size={18} className="text-green-600" />,
      iconBg: 'bg-green-50',
      label: 'Certificats',
      value: 300,
      sub: 'Validés',
      subValue: 278,
      change: 9,
    },
    {
      icon: <QrCode size={18} className="text-cyan-600" />,
      iconBg: 'bg-cyan-50',
      label: 'Vérifications QR',
      value: '18,765',
      sub: '16 meis ei',
      subValue: '',
      change: 15,
    },
    {
      icon: <ShieldAlert size={18} className="text-red-600" />,
      iconBg: 'bg-red-50',
      label: 'Alertes de Fraude',
      value: 100,
      sub: 'Actives',
      subValue: 27,
      change: 3,
    },
  ];

  return (
    <div className="grid grid-cols-7 gap-3">
      {stats.map(stat => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
