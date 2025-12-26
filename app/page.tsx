import Header from '@/components/Header';
import HomeOptions from '@/components/HomeOptions';
import { getBillData } from '@/lib/get-data';

export default async function Home() {
  const billData = await getBillData();
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 pt-4 pb-8 max-w-4xl">
        <Header tableData={billData.table} headerConfigKey="home" />
        <div className="pt-4">
          <HomeOptions />
        </div>
      </div>
    </main>
  );
}
