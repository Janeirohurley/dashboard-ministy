import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', value: 12 },
  { month: 'Fev', value: 20 },
  { month: 'Mar', value: 15 },
  { month: 'Avr', value: 28 },
  { month: 'Mai', value: 22 },
  { month: 'Jun', value: 35 },
  { month: 'Jul', value: 25 },
  { month: 'Aug', value: 38 },
  { month: 'Sep', value: 45 },
  { month: 'Oct', value: 40 },
  { month: 'Nov', value: 32 },
  { month: 'Dec', value: 28 },
];

export default function FraudChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Détection de fraude</h3>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: -25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              formatter={(v) => [String(v), 'Alertes']}
            />
            <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <button className="mt-2 w-full border border-gray-200 rounded-lg py-1.5 text-[10px] text-gray-500 hover:bg-gray-50 transition-colors">
        Voir toutes les alertes
      </button>
    </div>
  );
}
