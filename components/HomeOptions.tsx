import Link from 'next/link';

export default function HomeOptions() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          ¿Cómo quieres dividir la cuenta?
        </h2>
        <p className="text-slate-600">
          Elige el método que mejor se adapte a tu situación
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link 
          href="/split-equal"
          className="group block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-500"
        >
          <div className="text-center">
            <div className="mb-4 text-5xl">⚖️</div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-green-600 transition-colors">
              Dividir por igual
            </h3>
            <p className="text-slate-600 mb-4">
              Divide el total de la cuenta entre todos los comensales. Todos pagan la misma cantidad.
            </p>
            <div className="mt-6 inline-flex items-center text-green-600 font-semibold group-hover:translate-x-1 transition-transform">
              Continuar
              <span className="ml-2">→</span>
            </div>
          </div>
        </Link>

        <Link 
          href="/split-bill"
          className="group block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-500"
        >
          <div className="text-center">
            <div className="mb-4 text-5xl">🍽️</div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
              Cada uno lo suyo
            </h3>
            <p className="text-slate-600 mb-4">
              Asigna cada item de la cuenta a las personas que lo consumieron. Pago personalizado por persona.
            </p>
            <div className="mt-6 inline-flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
              Continuar
              <span className="ml-2">→</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

