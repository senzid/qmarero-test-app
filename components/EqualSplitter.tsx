'use client';

import { useState, useMemo, useEffect } from 'react';
import type { BillData } from '@/lib/types';
import Card from './Card';
import GoToPayment from './GoToPayment';
import PeopleSection from './PeopleSection';
import { useSplitData } from '@/lib/use-split-data';
import { formatCurrency } from '@/lib/format-currency';

interface Person {
  id: string;
  name: string;
}

export default function EqualSplitter({ billData }: { billData: BillData }) {
  const { saveSplitData } = useSplitData();
  
  const getInitialPeople = (): Person[] => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('qamarero-split-data');
        if (stored) {
          const data = JSON.parse(stored);
          if (data.type === 'split-equal' && data.people && data.people.length > 0) {
            return data.people;
          }
        }
      } catch (e) {
        console.error('Error loading initial state:', e);
      }
    }
    return [
      { id: '1', name: 'Persona 1' },
      { id: '2', name: 'Persona 2' },
    ];
  };

  const [people, setPeople] = useState<Person[]>(getInitialPeople);

  const calculations = useMemo(() => {
    const grandTotal = billData.items.reduce(
      (sum, item) => sum + (item.qty * item.unitPrice),
      0
    );
    
    if (people.length === 0) {
      return {
        grandTotal,
        perPerson: 0,
        personAmounts: {},
      };
    }
    
    // Convertir a centimos para evitar errores de redondeo
    const totalCentimos = Math.round(grandTotal * 100);
    const baseCentimos = Math.floor(totalCentimos / people.length);
    const resto = totalCentimos % people.length;
    
    // Calcular el monto por persona en euros
    // Las primeras 'resto' personas pagarán 1 centimo más
    const personAmounts: { [personId: string]: number } = {};
    people.forEach((person, index) => {
      const centimos = baseCentimos + (index < resto ? 1 : 0);
      personAmounts[person.id] = centimos / 100;
    });
    
    // Para mostrar, usar el promedio (aunque algunas personas pagarán 1 centimo más)
    const perPerson = baseCentimos / 100;
    const hasRemainder = resto > 0;
    const minAmount = baseCentimos / 100;
    const maxAmount = (baseCentimos + 1) / 100;
    
    return {
      grandTotal,
      perPerson,
      personAmounts,
      hasRemainder,
      minAmount,
      maxAmount,
    };
  }, [billData.items, people]);

  useEffect(() => {
    // Usar los montos exactos calculados en centimos
    const personTotals = calculations.personAmounts || {};

    saveSplitData({
      type: 'split-equal',
      tableId: billData.table.id,
      people,
      personTotals,
      grandTotal: calculations.grandTotal,
      currency: billData.currency,
    });
  }, [people, calculations, billData.currency, saveSplitData, billData.table.id]);

  const addPerson = () => {
    const newId = String(people.length + 1);
    setPeople([...people, { id: newId, name: `Persona ${newId}` }]);
  };

  const updatePersonName = (id: string, name: string) => {
    setPeople(people.map(p => p.id === id ? { ...p, name } : p));
  };

  const removePerson = (id: string) => {
    if (people.length <= 1) return;
    setPeople(people.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <PeopleSection
        people={people}
        onAddPerson={addPerson}
        onUpdatePersonName={updatePersonName}
        onRemovePerson={removePerson}
      />

      <Card>
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-4">
          Resumen
        </h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-slate-100 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-medium text-slate-700">
                Total de la cuenta:
              </span>
              <span className="text-xl md:text-2xl font-bold text-slate-900">
                {formatCurrency(calculations.grandTotal, billData.currency)}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-300">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-slate-700">
                  Por persona ({people.length}):
                </span>
                <span className="text-xl md:text-2xl font-bold text-green-600">
                  {calculations.hasRemainder ? (
                    <span>
                      {formatCurrency(calculations.minAmount, billData.currency)} - {formatCurrency(calculations.maxAmount, billData.currency)}
                    </span>
                  ) : (
                    formatCurrency(calculations.perPerson, billData.currency)
                  )}
                </span>
              </div>
              {calculations.hasRemainder && (
                <p className="text-sm text-slate-600 mt-1">
                  Algunas personas pagarán 1 céntimo más para cuadrar el total
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>


      <GoToPayment type="split-equal" />

    </div>
  );
}

