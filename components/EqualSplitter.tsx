'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { BillData } from '@/lib/types';
import Card from './Card';

interface Person {
  id: string;
  name: string;
}

export default function EqualSplitter({ billData }: { billData: BillData }) {
  const [people, setPeople] = useState<Person[]>([
    { id: '1', name: 'Persona 1' },
    { id: '2', name: 'Persona 2' },
  ]);
  const [whoPaid, setWhoPaid] = useState<string | null>(null);

  const calculations = useMemo(() => {
    const grandTotal = billData.items.reduce(
      (sum, item) => sum + (item.qty * item.unitPrice),
      0
    );
    const perPerson = people.length > 0 ? grandTotal / people.length : 0;
    
    return {
      grandTotal,
      perPerson,
    };
  }, [billData.items, people.length]);

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
    if (whoPaid === id) setWhoPaid(null);
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
              className="flex items-center gap-3"
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
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Eliminar"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Total Summary */}
      <Card>
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">
          Resumen
        </h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-slate-100 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-medium text-slate-700">
                Total de la cuenta:
              </span>
              <span className="text-2xl font-bold text-slate-900">
                {formatCurrency(calculations.grandTotal)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-300">
              <span className="text-lg font-medium text-slate-700">
                Por persona ({people.length}):
              </span>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(calculations.perPerson)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Section */}
      <Card>
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">
          ¿Quién pagó?
        </h2>
        
        <div className="space-y-3">
          {people.map(person => {
            const isPayer = whoPaid === person.id;
            
            return (
              <div
                key={person.id}
                className={`p-4 rounded-lg border-2 ${
                  isPayer
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-slate-200 bg-slate-50'
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
                      {formatCurrency(calculations.perPerson)}
                    </span>
                    {!isPayer && (
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
              </div>
            );
          })}
        </div>

        {whoPaid && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">
              💡 División después del pago
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              {people
                .filter(p => p.id !== whoPaid)
                .map(person => {
                  const payer = people.find(p => p.id === whoPaid);
                  return (
                    <div key={person.id} className="flex justify-between">
                      <span>{person.name} debe pagar a {payer?.name}:</span>
                      <span className="font-semibold">{formatCurrency(calculations.perPerson)}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </Card>

      {/* Back to selection */}
      <div className="text-center">
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

