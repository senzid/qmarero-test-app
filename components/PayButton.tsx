'use client'

import { useState } from 'react'
import type { SplitData } from '@/lib/use-split-data'

interface PayButtonProps {
  splitData: SplitData
  method: string
}

export function PayButton({ splitData, method }: PayButtonProps) {
  const [tip, setTip] = useState<number | null>(null)

  const pay = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        splitData: {
          method: method,
          type: splitData.type,
          tableId: splitData.tableId,
          people: splitData.people,
          personTotals: splitData.personTotals,
          grandTotal: splitData.grandTotal,
          tip: tip || 0,
        },
      }),
    })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <div className="w-full space-y-4">
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
      <button
        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
        onClick={pay}
      >
        Proceder al pago
      </button>
    </div>
  )
}
