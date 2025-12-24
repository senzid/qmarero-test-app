'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { BillData } from '@/lib/types';
import Card from './Card';

interface Person {
  id: string;
  name: string;
}

interface ItemAssignment {
  [itemId: string]: string[];
}

export default function BillSplitter({ billData }: { billData: BillData }) {
  const [people, setPeople] = useState<Person[]>([
    { id: '1', name: 'Persona 1' },
    { id: '2', name: 'Persona 2' },
  ]);
  const [itemAssignments, setItemAssignments] = useState<ItemAssignment>({});
  const [whoPaid, setWhoPaid] = useState<string | null>(null);

  // Calculate totals
  const calculations = useMemo(() => {
    const itemTotals: { [itemId: string]: number } = {};
    const personTotals: { [personId: string]: number } = {};
    
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
        const perPerson = total / assignedPeople.length;
        assignedPeople.forEach(personId => {
          personTotals[personId] = (personTotals[personId] || 0) + perPerson;
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
    };
  }, [billData.items, itemAssignments, people]);

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
    if (whoPaid === id) setWhoPaid(null);
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

  const splitAllEqually = () => {
    const allAssignments: ItemAssignment = {};
    billData.items.forEach(item => {
      allAssignments[item.id] = people.map(p => p.id);
    });
    setItemAssignments(allAssignments);
  };

  const clearItemAssignment = (itemId: string) => {
    setItemAssignments(prev => {
      const newAssignments = { ...prev };
      delete newAssignments[itemId];
      return newAssignments;
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: billData.currency,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* People Section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-slate-900">
            Comensales
          </h2>
          <button
            onClick={addPerson}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            + Agregar persona
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {people.map(person => (
            <div
              key={person.id}
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
            >
              <input
                type="text"
                value={person.name}
                onChange={(e) => updatePersonName(person.id, e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {people.length > 1 && (
                <button
                  onClick={() => removePerson(person.id)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  title="Eliminar"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">
          Acciones rápidas
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={splitAllEqually}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Dividir todo por igual
          </button>
          <button
            onClick={() => setItemAssignments({})}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Limpiar asignaciones
          </button>
        </div>
      </Card>

      {/* Items Section */}
      <Card>
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">
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
                <div className="flex items-start justify-between mb-3">
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
                        {formatCurrency(itemTotal)}
                      </span>
                      {isFullyAssigned && (
                        <span className="text-sm text-green-700 font-medium">
                          {formatCurrency(itemTotal / assignedPeople.length)} por persona
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
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

      {/* Summary Section */}
      <Card>
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">
          Resumen de pagos
        </h2>
        
        <div className="mb-6 p-4 bg-slate-100  rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-slate-700">
              Total de la cuenta:
            </span>
            <span className="text-2xl font-bold text-slate-900">
              {formatCurrency(calculations.grandTotal)}
            </span>
          </div>
          {calculations.unassignedTotal > 0 && (
            <div className="mt-2 text-sm text-amber-600">
              ⚠️ {formatCurrency(calculations.unassignedTotal)} sin asignar
            </div>
          )}
        </div>

        <div className="space-y-3">
          {people.map(person => {
            const total = calculations.personTotals[person.id] || 0;
            const isPayer = whoPaid === person.id;
            
            return (
              <div
                key={person.id}
                className={`p-4 rounded-lg border-2 ${
                  isPayer
                    ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 /50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-900">
                      {person.name}
                    </span>
                    {isPayer && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded">
                        Pagó
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-slate-900">
                      {formatCurrency(total)}
                    </span>
                    {!isPayer && total > 0 && (
                      <button
                        onClick={() => setWhoPaid(person.id)}
                        className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                      >
                        Marcar como pagó
                      </button>
                    )}
                    {isPayer && (
                      <button
                        onClick={() => setWhoPaid(null)}
                        className="px-3 py-1.5 text-sm bg-slate-600 hover:bg-slate-700 text-white rounded-md transition-colors"
                      >
                        Desmarcar
                      </button>
                    )}
                  </div>
                </div>
                {isPayer && total > 0 && (
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    <p className="text-sm text-blue-700">
                      {person.name} pagó {formatCurrency(total)}. 
                      {people.filter(p => p.id !== person.id && (calculations.personTotals[p.id] || 0) > 0).length > 0 && (
                        <span> Debe recibir de los demás.</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {whoPaid && calculations.personTotals[whoPaid] > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">
              💡 División después del pago
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              {people
                .filter(p => p.id !== whoPaid && (calculations.personTotals[p.id] || 0) > 0)
                .map(person => {
                  const owes = calculations.personTotals[person.id] || 0;
                  const payer = people.find(p => p.id === whoPaid);
                  return (
                    <div key={person.id} className="flex justify-between">
                      <span>{person.name} debe pagar a {payer?.name}:</span>
                      <span className="font-semibold">{formatCurrency(owes)}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </Card>

      {/* Back to selection */}
      <div className="text-center mt-6">
        <Link
          href="/"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors"
        >
          <span className="mr-2">←</span>
          Volver a seleccionar método
        </Link>
      </div>
    </div>
  );
}

