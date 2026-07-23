import { ArrowUpRight } from 'lucide-react';

const filières = [
  { label: 'Sciences', value: 82.45, color: '#3b82f6' },
  { label: 'Lettres', value: 71.30, color: '#8b5cf6' },
  { label: 'Techniques', value: 76.80, color: '#10b981' },
  { label: 'Économie', value: 72.10, color: '#f59e0b' },
  { label: 'Économnge', value: 72.10, color: '#ec4899' },
];

const institutions = [
  { name: '1. Institut Supérieur de Management', count: 15, level: 'Élevé', color: 'text-red-600', bg: 'bg-red-50' },
  { name: '2. Collège des Technologies Avancées', count: 12, level: 'Élevé', color: 'text-red-600', bg: 'bg-red-50' },
  { name: "3. Université Spésif d'Affrique", count: 9, level: 'Mayen', color: 'text-amber-600', bg: 'bg-amber-50' },
  { name: '4. ITAB - Traduit Technique', count: 7, level: 'Mayen', color: 'text-amber-600', bg: 'bg-amber-50' },
  { name: '5. Institut Polytegthique de Griege', count: 7, level: 'Fable', color: 'text-green-600', bg: 'bg-green-50' },
];

export default function ExamsWidget() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Examens nationaux - Session 2024</h3>
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-2.5">
          <div className="text-[10px] text-gray-500 mb-1">Taux de réussite</div>
          <div className="text-xl font-bold text-gray-900">78.45%</div>
          <div className="flex items-center gap-1">
            <ArrowUpRight size={10} className="text-emerald-500" />
            <span className="text-[10px] text-emerald-500 font-semibold">5.2%</span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2.5">
          <div className="text-[10px] text-gray-500 mb-1">Candidats</div>
          <div className="text-xl font-bold text-gray-900">24,560</div>
          <div className="flex items-center gap-1">
            <ArrowUpRight size={10} className="text-emerald-500" />
            <span className="text-[10px] text-emerald-500 font-semibold">3.1%</span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2.5">
          <div className="text-[10px] text-gray-500 mb-1">Moyenne nationale</div>
          <div className="text-xl font-bold text-gray-900">68.75%</div>
          <div className="flex items-center gap-1">
            <ArrowUpRight size={10} className="text-emerald-500" />
            <span className="text-[10px] text-emerald-500 font-semibold">4.6%</span>
          </div>
        </div>
      </div>
      {/* Performance per filière */}
      <div className="mb-3">
        <div className="text-[10px] font-semibold text-gray-600 mb-2">Performance per filière</div>
        <div className="space-y-1.5">
          {filières.map(f => (
            <div key={f.label} className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 w-20 shrink-0">{f.label}</span>
              <div className="flex-1 h-3.5 bg-gray-100 rounded overflow-hidden">
                <div
                  className="h-full rounded transition-all"
                  style={{ width: `${f.value}%`, backgroundColor: f.color }}
                />
              </div>
              <span className="text-[10px] font-semibold text-gray-700 w-12 text-right">{f.value}%</span>
            </div>
          ))}
        </div>
      </div>
      {/* Top institutions */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="text-[10px] font-semibold text-gray-600 mb-2">Top 5 institutions à risque</div>
        <div className="space-y-1.5">
          {institutions.map((inst, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[10px] text-gray-600 flex-1 truncate">{inst.name}</span>
              <span className="text-[10px] text-gray-500">{inst.count} alertes</span>
              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${inst.bg} ${inst.color}`}>{inst.level}</span>
            </div>
          ))}
        </div>
      </div>
      <button className="mt-3 w-full border border-gray-200 rounded-lg py-1.5 text-[10px] text-gray-500 hover:bg-gray-50 transition-colors">
        Voir toutes les stalidations
      </button>
    </div>
  );
}
