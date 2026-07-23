import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'D', value: 30 },
  { name: 'L', value: 65 },
  { name: 'M', value: 45 },
  { name: 'M', value: 70 },
  { name: 'V', value: 35 },
  { name: 'S', value: 55 },
  { name: 'D', value: 40 },
];

export default function BarMini() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Activité hebdomadaire</h3>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -28 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Bar dataKey="value" radius={[3, 3, 0, 0]} barSize={16}>
              {data.map((_, i) => (
                <Cell key={i} fill={i === 3 ? '#3b82f6' : '#93c5fd'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
