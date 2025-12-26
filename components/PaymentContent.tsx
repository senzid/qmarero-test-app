"use client"

import { useSplitData } from '@/lib/use-split-data'
import { PayButton } from './PayButton'
import Card from './Card'
import { formatCurrency } from '@/lib/format-currency'

export default function PaymentContent({ method }: { method: string }) {
  const { splitData, isLoading } = useSplitData()

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">Cargando datos...</p>
      </div>
    )
  }

  if (!splitData) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600 mb-4">No hay datos de división disponibles</p>
        <p className="text-sm text-slate-500">
          Por favor, vuelve a la página anterior para configurar la división de la cuenta.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Resumen de pagos
        </h3>
        <div className="space-y-2">
          {splitData.people.map(person => {
            const total = splitData.personTotals[person.id] || 0
            
            return (
              <div
                key={person.id}
                className="flex justify-between items-center p-3 rounded-lg bg-slate-50"
              >
                <span className="font-medium text-slate-900">{person.name}</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(total, splitData.currency)}
                </span>
              </div>
            )
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-slate-700">Total:</span>
            <span className="text-xl md:text-2xl font-bold text-slate-900">
              {formatCurrency(splitData.grandTotal, splitData.currency)}
            </span>
          </div>
        </div>
      </Card>

      {method === 'card' ?
        <PayButton splitData={splitData} method={method} /> 
      :
        <Card className="border border-slate-200">
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <svg 
                className="w-8 h-8 text-slate-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                />
              </svg>
            </div>
            <p className="text-slate-700 font-medium text-lg">Listo para pagar</p>
            <p className="text-slate-500 text-sm mt-1">Avisa y solicita la cuenta al camarero</p>
          </div>
        </Card>
      }

      
    </div>
  )
  
  
  
  
}

