import React from 'react'

export function Tips({ tip, setTip }: { tip: number | null, setTip: (tip: number | null) => void }) {
  console.log(tip)
  return (
    <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      ¿Añadir propina?
    </label>
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => setTip(null)}
        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
          tip === null
            ? 'bg-slate-200 text-slate-700'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
      >
        Sin propina
      </button>
      <button
        type="button"
        onClick={() => setTip(1)}
        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
          tip === 1
            ? 'bg-emerald-600 text-white'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
      >
        1€
      </button>
      <button
        type="button"
        onClick={() => setTip(2)}
        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
          tip === 2
            ? 'bg-emerald-600 text-white'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
      >
        2€
      </button>
      <button
        type="button"
        onClick={() => setTip(5)}
        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
          tip === 5
            ? 'bg-emerald-600 text-white'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
      >
        5€
      </button>
    </div>
  </div>
  )
}