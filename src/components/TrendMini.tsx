import { AreaChart, Area, XAxis, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 30 },
  { name: 'Feb', value: 45 },
  { name: 'Mar', value: 38 },
  { name: 'Apr', value: 60 },
  { name: 'May', value: 55 },
  { name: 'Jun', value: 48 },
];

export default function TrendMini() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Tendance des inscriptions</h3>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -30 }}>
            <defs>
              <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} fill="url(#trendGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
