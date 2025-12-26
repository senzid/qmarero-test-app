import BackButton from './BackButton';

type TableData = {
  id: string;
  name: string;
  server: string;
};

const headerConfig = {
  home: {
    title: 'Pagar la cuenta',
    showBackButton: false,
    url: '/',
    goBackUrl: '/payment',
  },
  splitEqual: {
    title: 'Dividir por igual',
    showBackButton: true,
    url: '/split-equal',
    goBackUrl: '/',
  },
  splitBill: {
    title: 'Cada uno lo suyo',
    showBackButton: true,
    url: '/split-bill',
    goBackUrl: '/',
  },
  payment: {
    title: 'Pagar la cuenta',
    showBackButton: true,
    url: '/payment',
    goBackUrl: '/',
  },
  success: {
    title: 'Pago exitoso',
    showBackButton: false,
    url: '/success',
    goBackUrl: '/',
  },
};

export default function Header ({ 
  tableData,
  headerConfigKey,
  customGoBackUrl
}: { 
  tableData: TableData;
  headerConfigKey: keyof typeof headerConfig;
  customGoBackUrl?: string;
}) {

  const { title, showBackButton, goBackUrl } = headerConfig[headerConfigKey];

  const goBackHref = customGoBackUrl || goBackUrl

  return (
    <header className="sticky top-0 z-50 bg-linear-to-br from-slate-50 to-slate-100/90 backdrop-blur-sm bg-opacity-95 border-b border-slate-200/50 mb-8 -mx-4 px-4 py-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-4 mb-3">
          {showBackButton && <BackButton goBackHref={goBackHref} />}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-4 text-slate-600">
          <span className="font-medium">Mesa {tableData.name}</span>
          <span>•</span>
          <span>Camarero/a: {tableData.server}</span>
        </div>
      </div>
    </header>
  );
}
