import Link from 'next/link';
import { formatCurrency } from '@/lib/format-currency';
interface GoToPaymentProps {
  type: 'split-equal' | 'split-bill';
  disabled?: boolean;
  unassignedTotal?: number;
  currency?: string;
}

export default function GoToPayment({ type, disabled = false, unassignedTotal = 0, currency = 'EUR' }: GoToPaymentProps) {

  const linkClassName = disabled
    ? "group block p-8 bg-slate-100 rounded-xl shadow-sm border-2 border-slate-300 cursor-not-allowed opacity-60"
    : "group block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-slate-400";

  const linkClassNameHighlighted = disabled
    ? "group relative block p-8 bg-slate-100 rounded-xl shadow-sm border-2 border-slate-300 cursor-not-allowed opacity-60"
    : "group relative block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-green-400 hover:border-green-500";

  return (
    <div className="mt-8 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
          ¿Cómo quieres pagar?
        </h2>
        <p className="text-slate-600">
          Elige el método de pago que prefieras
        </p>
      </div>

      {disabled && unassignedTotal > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-300 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-xl md:text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-amber-900 mb-1">
                No puedes proceder al pago
              </p>
              <p className="text-sm text-amber-800">
                Tienes {formatCurrency(unassignedTotal, currency)} sin asignar. Por favor, asigna todos los items antes de continuar.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {disabled ? (
          <div className={linkClassName}>
            <div className="text-center">
              <div className="mb-4 text-5xl">👋</div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-500 mb-3">
                Avisar al camarero
              </h3>
              <p className="text-slate-500 mb-4">
                Avisa a tu camarero para pagar en persona. Ideal si prefieres pagar con efectivo o hablar directamente con el personal.
              </p>
              <div className="mt-6 inline-flex items-center text-slate-400 font-semibold">
                No disponible
              </div>
            </div>
          </div>
        ) : (
          <Link
            href={`/payment?method=waiter&type=${type}`}
            className={linkClassName}
          >
            <div className="text-center">
              <div className="mb-4 text-5xl">👋</div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">
                Avisar al camarero
              </h3>
              <p className="text-slate-600 mb-4">
                Avisa a tu camarero para pagar en persona. Ideal si prefieres pagar con efectivo o hablar directamente con el personal.
              </p>
              <div className="mt-6 inline-flex items-center text-slate-700 font-semibold group-hover:translate-x-1 transition-transform">
                Continuar
                <span className="ml-2">→</span>
              </div>
            </div>
          </Link>
        )}

        {disabled ? (
          <div className={linkClassNameHighlighted}>
            <div className="text-center">
              <div className="mb-4 text-5xl">💳</div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-500 mb-3">
                Pago rápido en mesa
              </h3>
              <p className="text-slate-500 mb-4">
                Un comensal paga ahora con tarjeta u otros métodos. Los demás le pagarán después. El método más rápido para pagar directamente en la mesa.
              </p>
              <div className="mt-6 inline-flex items-center text-slate-400 font-semibold">
                No disponible
              </div>
            </div>
          </div>
        ) : (
          <Link
            href={`/payment?method=card&type=${type}`}
            className={linkClassNameHighlighted}
          >
            <div className="absolute -top-3 -right-3 bg-linear-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
              <span>⚡</span>
              <span>MÁS RÁPIDO</span>
            </div>
            
            <div className="text-center">
              <div className="mb-4 text-5xl">💳</div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-green-600 transition-colors">
                Pago rápido en mesa
              </h3>
              <p className="text-slate-600 mb-4">
                Un comensal paga ahora con tarjeta u otros métodos. Los demás le pagarán después. El método más rápido para pagar directamente en la mesa.
              </p>
              <div className="mt-6 inline-flex items-center text-green-600 font-semibold group-hover:translate-x-1 transition-transform">
                Continuar
                <span className="ml-2">→</span>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
