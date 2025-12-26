'use client';

import { useState, useEffect } from 'react';
import { BillData } from '@/lib/types.d';
import { formatCurrency } from '@/lib/format-currency';

interface BillReviewModalProps {
  billData: BillData;
}

export default function BillReviewModal({ billData }: BillReviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setTimeout(() => setIsAnimating(false), 10);
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const total = billData.items.reduce((sum, item) => {
    return sum + (item.qty * item.unitPrice);
  }, 0);

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-sm max-w-20 md:max-w-40 text-center"
      >
        <span>Ver cuenta</span>
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={handleClose}
        >
          <div 
            className={`bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 ${
              isAnimating 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-4 scale-95'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Detalle de la cuenta
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    {billData.table.name} • Mesa {billData.table.id} • Camarero/a: {billData.table.server}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="text-slate-400 hover:text-slate-600 transition-colors text-2xl leading-none"
                  aria-label="Cerrar"
                >
                  X
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {billData.items.map((item) => {
                  const itemTotal = item.qty * item.unitPrice;
                  return (
                    <div
                      key={item.id}
                      className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex-1">
                        <div className="flex items-start gap-2">
                          <h3 className="font-semibold text-slate-900">
                            {item.name}
                          </h3>
                        </div>
                        <div className="mt-1 text-sm text-slate-600">
                          {item.qty} × {formatCurrency(item.unitPrice, billData.currency)}
                        </div>
                        {item.notes && (
                          <p className="mt-1 text-xs text-slate-500 italic">
                            {item.notes}
                          </p>
                        )}
                      </div>
                      <div className="ml-4 text-right">
                        <div className="font-semibold text-slate-900">
                          {formatCurrency(itemTotal, billData.currency)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-slate-900">
                  Total:
                </span>
                <span className="text-2xl font-bold text-slate-900">
                  {formatCurrency(total, billData.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

