'use client'

import type { SplitData } from '@/lib/use-split-data'

interface PayButtonProps {
  splitData: SplitData
  method: string
  tip: number | null
}

export function PayButton({ splitData, method, tip }: PayButtonProps) {

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
      <button
        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
        onClick={pay}
      >
        Proceder al pago
      </button>
  )
}
