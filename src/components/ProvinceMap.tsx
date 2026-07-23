import { useState } from 'react';
import { BurundiMap, type BurundiProvince, type BurundiProvinceStyle } from '@/components/BurundiMap';

type ProvinceStat = {
  name: string;
  students: number;
};

const provinceStats: ProvinceStat[] = [
  { name: 'Bujumbura Mairie', students: 24560 },
  { name: 'Gitega', students: 18450 },
  { name: 'Ngozi', students: 14230 },
  { name: 'Bururi', students: 12450 },
  { name: 'Muyinga', students: 11230 },
  { name: 'Bujumbura Rural', students: 10890 },
  { name: 'Kayanza', students: 9760 },
  { name: 'Ruyigi', students: 8540 },
  { name: 'Muramvya', students: 7320 },
  { name: 'Kirundo', students: 6890 },
  { name: 'Makamba', students: 6210 },
  { name: 'Cibitoke', students: 5780 },
  { name: 'Rutana', students: 5120 },
  { name: 'Karuzi', students: 4650 },
  { name: 'Cankuzo', students: 3890 },
  { name: 'Bubanza', students: 3420 },
  { name: 'Mwaro', students: 2980 },
];

const maxStudents = Math.max(...provinceStats.map((p) => p.students));
const totalStudents = provinceStats.reduce((sum, p) => sum + p.students, 0);

function colorForValue(value: number): string {
  const ratio = value / maxStudents;
  const stops = [
    { t: 0, color: [219, 234, 254] },
    { t: 0.25, color: [147, 197, 253] },
    { t: 0.5, color: [96, 165, 250] },
    { t: 0.75, color: [37, 99, 235] },
    { t: 1, color: [30, 64, 175] },
  ];
  for (let i = 0; i < stops.length - 1; i++) {
    if (ratio <= stops[i + 1].t) {
      const span = stops[i + 1].t - stops[i].t;
      const local = span === 0 ? 0 : (ratio - stops[i].t) / span;
      const r = Math.round(stops[i].color[0] + (stops[i + 1].color[0] - stops[i].color[0]) * local);
      const g = Math.round(stops[i].color[1] + (stops[i + 1].color[1] - stops[i].color[1]) * local);
      const b = Math.round(stops[i].color[2] + (stops[i + 1].color[2] - stops[i].color[2]) * local);
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
  return 'rgb(30, 64, 175)';
}

const statByName = new Map(provinceStats.map((p) => [p.name, p.students]));

const provinceStyles: Record<string, BurundiProvinceStyle> = {};
for (const stat of provinceStats) {
  provinceStyles[stat.name] = { fill: colorForValue(stat.students) };
}

const sortedLegend = [...provinceStats].sort((a, b) => b.students - a.students);

export default function ProvinceMap() {
  const [activeProvince, setActiveProvince] = useState<string | null>(null);

  const activeStat = activeProvince
    ? provinceStats.find((p) => p.name === activeProvince) ?? null
    : null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-800">Répartition des étudiants par province</h3>
        <span className="text-[10px] text-gray-400">{totalStudents.toLocaleString('fr-FR')}</span>
      </div>

      <div className="relative w-full max-w-[260px] mx-auto">
        <BurundiMap
          className="overflow-visible"
          defaultFill="#e5e7eb"
          defaultStroke="#ffffff"
          defaultStrokeWidth={1.5}
          selectedFill={activeProvince ? colorForValue(statByName.get(activeProvince) ?? 0) : '#51bbbf'}
          provinceStyles={provinceStyles}
          activeProvinceId={activeProvince}
          onProvinceClick={(province: BurundiProvince) =>
            setActiveProvince((current) => (current === province.name ? null : province.name))
          }
          renderProvinceOverlay={(province: BurundiProvince) => {
            const value = statByName.get(province.name);
            if (value === undefined) return null;
            const isActive = activeProvince === province.name;
            return (
              <text
                x={province.centroid.x}
                y={province.centroid.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={value > 10000 ? 15 : value > 5000 ? 13 : 11}
                fontWeight={isActive ? 700 : 600}
                fill={value > 12000 ? '#ffffff' : '#1e3a5f'}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
              </text>
            );
          }}
        />
      </div>

      {activeStat && (
        <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-blue-900">{activeStat.name}</span>
          <span className="text-[11px] font-bold text-blue-700">
            {activeStat.students.toLocaleString('fr-FR')} étudiants
          </span>
        </div>
      )}

      <div className="mt-2 flex flex-col gap-1 overflow-y-auto max-h-[120px] pr-1">
        {sortedLegend.map((p) => (
          <div
            key={p.name}
            className={`flex items-center gap-2 px-1 py-0.5 rounded transition-colors ${
              activeProvince === p.name ? 'bg-blue-50' : 'hover:bg-gray-50'
            }`}
            onMouseEnter={() => setActiveProvince(p.name)}
            onMouseLeave={() => setActiveProvince(null)}
          >
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: colorForValue(p.students) }}
            />
            <span className="text-[10px] text-gray-600 flex-1 truncate">{p.name}</span>
            <span className="text-[10px] font-semibold text-gray-700">
              {p.students.toLocaleString('fr-FR')}
            </span>
          </div>
        ))}
      </div>

      <button className="mt-3 w-full border border-gray-200 rounded-lg py-1.5 text-[10px] text-gray-500 hover:bg-gray-50 transition-colors">
        Voir le rapport détaillé
      </button>
    </div>
  );
}
