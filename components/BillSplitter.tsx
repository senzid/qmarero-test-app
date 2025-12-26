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

interface ItemAssignment {
  [itemId: string]: string[];
}

export default function BillSplitter({ billData }: { billData: BillData }) {
  const { saveSplitData } = useSplitData();
  
  const getInitialState = () => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('qamarero-split-data');
        if (stored) {
          const data = JSON.parse(stored);
          if (data.type === 'split-bill') {
            return {
              people: data.people && data.people.length > 0 ? data.people : [
                { id: '1', name: 'Persona 1' },
                { id: '2', name: 'Persona 2' },
              ],
              itemAssignments: data.itemAssignments || {},
            };
          }
        }
      } catch (e) {
        console.error('Error loading initial state:', e);
      }
    }
    return {
      people: [
        { id: '1', name: 'Persona 1' },
        { id: '2', name: 'Persona 2' },
      ],
      itemAssignments: {},
    };
  };

  const initialState = getInitialState();
  const [people, setPeople] = useState<Person[]>(initialState.people);
  const [itemAssignments, setItemAssignments] = useState<ItemAssignment>(initialState.itemAssignments);

  // Helper function to split an amount correctly using centimos
  const splitAmount = (amount: number, numPeople: number): { [index: number]: number } => {
    if (numPeople === 0) return {};
    
    const totalCentimos = Math.round(amount * 100);
    const baseCentimos = Math.floor(totalCentimos / numPeople);
    const resto = totalCentimos % numPeople;
    
    const amounts: { [index: number]: number } = {};
    for (let i = 0; i < numPeople; i++) {
      const centimos = baseCentimos + (i < resto ? 1 : 0);
      amounts[i] = centimos / 100;
    }
    
    return amounts;
  };

  // Calculate totals
  const calculations = useMemo(() => {
    const itemTotals: { [itemId: string]: number } = {};
    const personTotals: { [personId: string]: number } = {};
    const itemPerPerson: { [itemId: string]: { min: number; max: number; hasRemainder: boolean } } = {};
    
    // Initialize person totals
    people.forEach(person => {
      personTotals[person.id] = 0;
    });

    // Calculate item totals and assign to people
    billData.items.forEach(item => {
      const total = item.qty * item.unitPrice;
      itemTotals[item.id] = total;
      
      const assignedPeople = itemAssignments[item.id] || [];
      
      if (assignedPeople.length > 0) {
        // Split using centimos to avoid rounding errors
        const splitAmounts = splitAmount(total, assignedPeople.length);
        
        // Calculate min/max for display
        const amounts = Object.values(splitAmounts);
        const min = Math.min(...amounts);
        const max = Math.max(...amounts);
        const hasRemainder = min !== max;
        
        itemPerPerson[item.id] = { min, max, hasRemainder };
        
        // Assign amounts to people (distribute remainder to first people)
        assignedPeople.forEach((personId, index) => {
          personTotals[personId] = (personTotals[personId] || 0) + splitAmounts[index];
        });
      }
    });

    const grandTotal = Object.values(itemTotals).reduce((sum, val) => sum + val, 0);
    const unassignedTotal = billData.items
      .filter(item => !itemAssignments[item.id] || itemAssignments[item.id].length === 0)
      .reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);

    return {
      itemTotals,
      personTotals,
      grandTotal,
      unassignedTotal,
      itemPerPerson,
    };
  }, [billData.items, itemAssignments, people]);

  useEffect(() => {
    saveSplitData({
      type: 'split-bill',
      tableId: billData.table.id,
      people,
      personTotals: calculations.personTotals,
      grandTotal: calculations.grandTotal,
      currency: billData.currency,
      itemAssignments,
    });
  }, [people, calculations.personTotals, calculations.grandTotal, billData.currency, itemAssignments, saveSplitData,billData.table.id]);

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
    const newAssignments = { ...itemAssignments };
    Object.keys(newAssignments).forEach(itemId => {
      newAssignments[itemId] = newAssignments[itemId].filter(pid => pid !== id);
    });
    setItemAssignments(newAssignments);
  };

  const toggleItemAssignment = (itemId: string, personId: string) => {
    setItemAssignments(prev => {
      const current = prev[itemId] || [];
      const isAssigned = current.includes(personId);
      
      if (isAssigned) {
        return {
          ...prev,
          [itemId]: current.filter(id => id !== personId),
        };
      } else {
        return {
          ...prev,
          [itemId]: [...current, personId],
        };
      }
    });
  };

  const splitItemEqually = (itemId: string) => {
    setItemAssignments(prev => ({
      ...prev,
      [itemId]: people.map(p => p.id),
    }));
  };

  const clearItemAssignment = (itemId: string) => {
    setItemAssignments(prev => {
      const newAssignments = { ...prev };
      delete newAssignments[itemId];
      return newAssignments;
    });
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
          Items de la cuenta
        </h2>
        <div className="space-y-4">
          {billData.items.map(item => {
            const assignedPeople = itemAssignments[item.id] || [];
            const itemTotal = item.qty * item.unitPrice;
            const isFullyAssigned = assignedPeople.length > 0;
            
            return (
              <div
                key={item.id}
                className={`p-4 rounded-lg border-2 ${
                  isFullyAssigned
                    ? 'border-green-200 bg-green-50'
                    : 'border-slate-200 bg-slate-50 /50'
                }`}
              >
                <div className="flex gap-2 md:gap-0 items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-slate-900">
                        {item.name}
                      </h3>
                      <span className="text-sm text-slate-600">
                        x{item.qty}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-sm text-slate-500 italic">
                        {item.notes}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-4">
                      <span className="text-lg font-bold text-slate-900">
                        {formatCurrency(itemTotal, billData.currency)}
                      </span>
                      {isFullyAssigned && (() => {
                        const perPersonInfo = calculations.itemPerPerson[item.id];
                        if (!perPersonInfo) return null;
                        
                        return (
                          <span className="text-sm text-green-700 font-medium">
                            {perPersonInfo.hasRemainder ? (
                              <>
                                {formatCurrency(perPersonInfo.min, billData.currency)} - {formatCurrency(perPersonInfo.max, billData.currency)} por persona
                              </>
                            ) : (
                              <>
                                {formatCurrency(perPersonInfo.min, billData.currency)} por persona
                              </>
                            )}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2">
                    <button
                      onClick={() => splitItemEqually(item.id)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition-colors"
                      title="Dividir por igual entre todos"
                    >
                      Dividir
                    </button>
                    {isFullyAssigned && (
                      <button
                        onClick={() => clearItemAssignment(item.id)}
                        className="px-3 py-1 text-sm bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-md transition-colors"
                        title="Limpiar asignación"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    ¿Quién consumió esto?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {people.map(person => {
                      const isAssigned = assignedPeople.includes(person.id);
                      return (
                        <button
                          key={person.id}
                          onClick={() => toggleItemAssignment(item.id, person.id)}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                            isAssigned
                              ? 'bg-green-600 text-white shadow-md'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          {person.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-4">
          Resumen de pagos
        </h2>
        
        <div className="mb-6 p-4 bg-slate-100  rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-slate-700">
              Total de la cuenta:
            </span>
            <span className="text-xl md:text-2xl font-bold text-slate-900">
              {formatCurrency(calculations.grandTotal, billData.currency)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {people.map(person => {
            const total = calculations.personTotals[person.id] || 0;
            
            return (
              <div
                key={person.id}
                className="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-slate-50 /50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">
                    {person.name}
                  </span>
                  <span className="text-xl md:text-2xl font-bold text-slate-900">
                    {formatCurrency(total, billData.currency)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <GoToPayment 
        type="split-bill" 
        disabled={calculations.unassignedTotal > 0}
        unassignedTotal={calculations.unassignedTotal}
        currency={billData.currency}
      />


    </div>
  );
}

