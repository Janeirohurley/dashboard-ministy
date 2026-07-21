const provinceData = [
  { name: 'Bujumbura Mairie', value: 24560, color: '#3b82f6', pct: 32 },
  { name: 'Gitega', value: 18450, color: '#10b981', pct: 24 },
  { name: 'Ngooi', value: 14230, color: '#f59e0b', pct: 18 },
  { name: 'Baluri', value: 12450, color: '#8b5cf6', pct: 16 },
  { name: 'Maphga', value: 11230, color: '#6b7280', pct: 7 },
  { name: 'Autres provinces', value: 0, color: '#d1d5db', pct: 3 },
];

export default function ProvinceMap() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Répartition des étudiants par province</h3>
      <div className="flex gap-4">
        {/* SVG Map of Burundi */}
        <div className="w-48 h-48 shrink-0">
          <svg viewBox="0 0 140 180" className="w-full h-full">
            {/* Simplified Burundi shape */}
            <defs>
              <linearGradient id="mapGrad1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            {/* Main country shape */}
            <path
              d="M45 15 L80 10 L105 25 L115 45 L120 70 L115 95 L110 120 L100 145 L85 165 L65 170 L45 155 L30 135 L20 110 L18 85 L22 60 L30 35 Z"
              fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5"
            />
            {/* Province divisions */}
            <path d="M45 15 L80 10 L105 25 L90 70 L65 60 L40 50 Z" fill="#3b82f6" opacity="0.8" />
            <path d="M40 50 L65 60 L90 70 L85 100 L55 95 L30 80 Z" fill="#10b981" opacity="0.7" />
            <path d="M55 95 L85 100 L80 125 L50 120 Z" fill="#f59e0b" opacity="0.7" />
            <path d="M50 120 L80 125 L75 150 L55 155 L35 135 Z" fill="#8b5cf6" opacity="0.7" />
            <path d="M30 80 L55 95 L50 120 L35 135 L20 110 L18 85 Z" fill="#6b7280" opacity="0.5" />
            {/* Province borders */}
            <path d="M45 15 L80 10 L105 25 L90 70 L65 60 L40 50 Z" fill="none" stroke="#fff" strokeWidth="1" />
            <path d="M40 50 L65 60 L90 70 L85 100 L55 95 L30 80 Z" fill="none" stroke="#fff" strokeWidth="1" />
            <path d="M55 95 L85 100 L80 125 L50 120 Z" fill="none" stroke="#fff" strokeWidth="1" />
            <path d="M50 120 L80 125 L75 150 L55 155 L35 135 Z" fill="none" stroke="#fff" strokeWidth="1" />
            {/* Lake Tanganyika */}
            <ellipse cx="28" cy="95" rx="10" ry="35" fill="#bfdbfe" opacity="0.6" />
            <text x="22" y="97" fontSize="5" fill="#3b82f6" fontWeight="600" opacity="0.8">Lac</text>
            {/* Dots for cities */}
            <circle cx="65" cy="40" r="3.5" fill="#fff" stroke="#1d4ed8" strokeWidth="1.5" />
            <circle cx="60" cy="78" r="3" fill="#fff" stroke="#065f46" strokeWidth="1.5" />
          </svg>
        </div>
        {/* Legend */}
        <div className="flex flex-col gap-1.5 justify-center flex-1">
          {provinceData.map(p => (
            <div key={p.name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: p.color }} />
              <span className="text-[10px] text-gray-600 flex-1 truncate">{p.name}</span>
              {p.value > 0 && (
                <span className="text-[10px] font-semibold text-gray-700">{p.value.toLocaleString()}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <button className="mt-3 w-full border border-gray-200 rounded-lg py-1.5 text-[10px] text-gray-500 hover:bg-gray-50 transition-colors">
        Voir le rapport détaillé
      </button>
    </div>
  );
}
