import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Réussies', value: 70, color: '#10b981', pct: '10%' },
  { name: 'En cours', value: 10, color: '#f59e0b', pct: '10%' },
  { name: 'Échouées', value: 15, color: '#ef4444', pct: '15%' },
  { name: 'Autres', value: 5, color: '#d1d5db', pct: '' },
];

export default function SyncChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Synchronisations nationales</h3>
      <div className="flex items-center gap-4">
        <div className="relative w-36 h-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={65}
                dataKey="value"
                strokeWidth={2}
                stroke="#fff"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [String(v), '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-2xl font-bold text-gray-900">100</div>
            <div className="text-[10px] text-gray-400">Total</div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          {data.filter(d => d.pct).map(d => (
            <div key={d.name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-[10px] text-gray-600 flex-1 truncate">{d.name}</span>
              <span className="text-[10px] font-semibold text-gray-700">{d.value}</span>
              <span className="text-[9px] text-gray-400">({d.pct})</span>
            </div>
          ))}
        </div>
      </div>
      <button className="mt-3 w-full border border-gray-200 rounded-lg py-1.5 text-[10px] text-gray-500 hover:bg-gray-50 transition-colors">
        Voir les synchronisations
      </button>
    </div>
  );
}
