"use client"

import { useState, useMemo } from 'react'
import { useSplitData } from '@/lib/use-split-data'
import { PayButton } from '@/features/payment/PayButton'
import Card from '@/components/Card'
import { formatCurrency } from '@/lib/format-currency'
import { Tips } from './Tips'

function distributeTip(tip: number, numPeople: number): number[] {
  if (tip <= 0 || numPeople <= 0) {
    return new Array(numPeople).fill(0)
  }

  const tipInCents = Math.round(tip * 100)
  
  const baseCentsPerPerson = Math.floor(tipInCents / numPeople)
  const remainder = tipInCents % numPeople
  
  const distribution = new Array(numPeople).fill(baseCentsPerPerson)
  for (let i = 0; i < remainder; i++) {
    distribution[i] += 1
  }
  
  return distribution.map(cents => cents / 100)
}

export default function PaymentContent({ method, initialTip }: { method: string, initialTip: number | null }) {
  const { splitData, isLoading } = useSplitData()
  const [tip, setTip] = useState<number | null>(initialTip)

  const tipDistribution = useMemo(() => {
    if (!tip || tip <= 0 || !splitData) {
      return new Array(splitData?.people.length || 0).fill(0)
    }
    return distributeTip(tip, splitData.people.length)
  }, [tip, splitData])

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
          {splitData.people.map((person, index) => {
            const baseTotal = splitData.personTotals[person.id] || 0
            const tipPerPerson = tipDistribution[index] || 0
            const totalWithTip = baseTotal + tipPerPerson
            
            return (
              <div
                key={person.id}
                className="min-h-12 px-3 py-1 rounded-lg bg-slate-50"
              >
                <div className="flex flex-1 justify-between items-center">
                  <span className="font-medium text-slate-900">{person.name}</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(totalWithTip, splitData.currency)}
                  </span>
                </div>
                {tip && tip > 0 && (
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>
                      {formatCurrency(baseTotal, splitData.currency)} + {formatCurrency(tipPerPerson, splitData.currency)} propina
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-slate-700">Total:</span>
            <span className="text-xl md:text-2xl font-bold text-slate-900">
              {formatCurrency(splitData.grandTotal + (tip || 0), splitData.currency)}
            </span>
          </div>
        </div>
      </Card>

      {method === 'card' ?
        <div className="w-full space-y-4">
          <Tips tip={tip} setTip={setTip} />
          <PayButton splitData={splitData} method={method} tip={tip} /> 
        </div>
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

