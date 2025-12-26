import Link from 'next/link';
import Header from '@/components/Header';
import { getBillData } from '@/lib/get-data';
import ClearSplitData from '@/components/ClearSplitData';

export default async function SuccessPage() {
  const billData = await getBillData();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <ClearSplitData />
      <div className="container mx-auto px-4 pt-4 pb-8 max-w-4xl">
        <Header tableData={billData.table} headerConfigKey="success" />
        
        <div className="pt-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            ¡Pago realizado con éxito!
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Tu pago se ha procesado correctamente. Gracias por tu compra.
          </p>

          <div className="bg-slate-50 rounded-lg p-6 mb-8">
            <p className="text-sm text-slate-500 mb-2">
              Recibirás un comprobante por correo electrónico
            </p>
            <p className="text-sm text-slate-500">
              Mesa {billData.table.name}
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            Volver al inicio
          </Link>
        </div>
        </div>
      </div>
    </main>
  );
}

