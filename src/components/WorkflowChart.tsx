const items = [
  { label: 'Brouillons', value: 25, color: '#3b82f6', max: 25 },
  { label: 'Semmis', value: 60, color: '#3b82f6', max: 60 },
  { label: 'En révision', value: 60, color: '#f59e0b', max: 60 },
  { label: 'Approuvés', value: 45, color: '#10b981', max: 60 },
  { label: 'Signés', value: 20, color: '#8b5cf6', max: 60 },
  { label: 'Complétés', value: 10, color: '#6b7280', max: 60 },
];

export default function WorkflowChart() {
  const maxVal = 60;
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Workflow de validation ministérielle</h3>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 w-20 shrink-0 text-right">{item.label}</span>
            <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
              <div
                className="h-full rounded transition-all"
                style={{ width: `${(item.value / maxVal) * 100}%`, backgroundColor: item.color }}
              />
            </div>
            <span className="text-[10px] font-semibold text-gray-700 w-5 text-right">{item.value}</span>
          </div>
        ))}
      </div>
      <button className="mt-3 w-full border border-gray-200 rounded-lg py-1.5 text-[10px] text-gray-500 hover:bg-gray-50 transition-colors">
        Voir tous les lots de validation
      </button>
    </div>
  );
}
