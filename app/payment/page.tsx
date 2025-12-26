import Header from '@/components/Header';
import PaymentContent from '@/components/PaymentContent';
import { getBillData } from '@/lib/get-data';

export default async function PaymentPage({ searchParams }: { searchParams: Promise<{ method: string, type: string }> }) {
  const billData = await getBillData();
  const method = (await searchParams).method;
  const type = (await searchParams).type;
  const goBackHref = type === 'split-equal' ? '/split-equal' : '/split-bill';
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 pt-4 pb-8 max-w-6xl">
        <Header tableData={billData.table} headerConfigKey="payment" customGoBackUrl={goBackHref} />
        <div className="pt-4">
          <PaymentContent method={method} />
        </div>
      </div>
    </main>
  );
}
