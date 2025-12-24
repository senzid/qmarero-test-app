import EqualSplitter from '@/components/EqualSplitter';
import Header from '@/components/Header';
import { getBillData } from '@/lib/get-data';

export default async function SplitEqual() {
  const billData = await getBillData();
  
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header tableData={billData.table} pathname="/split-equal" />
        <EqualSplitter billData={billData} />
      </div>
    </main>
  );
}

