import EqualSplitter from '@/components/EqualSplitter';
import Header from '@/components/Header';
import { getBillData } from '@/lib/get-data';

export default async function SplitEqual() {
  const billData = await getBillData();
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 pt-4 pb-8 max-w-6xl">
        <Header tableData={billData.table} headerConfigKey="splitEqual" />
        <div className="pt-4">
          <EqualSplitter billData={billData} />
        </div>
      </div>
    </main>
  );
}

