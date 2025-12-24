import Link from 'next/link';

type TableData = {
  id: string;
  name: string;
  server: string;
};

const titles: Record<string, string> = {
  '/': 'Pagar la cuenta',
  '/split-equal': 'Dividir por igual',
  '/split-bill': 'Cada uno lo suyo',
};

export default function Header ({ 
  tableData,
  pathname 
}: { 
  tableData: TableData;
  pathname: string;
}) {
  const title = titles[pathname] || 'Pagar la cuenta';
  const showBackButton = pathname !== '/';

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        {showBackButton && (
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-slate-100 transition-colors shadow-sm border border-slate-200"
            aria-label="Volver atrás"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-slate-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
        )}
        <h1 className="text-4xl font-bold text-slate-900">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-4 text-slate-600">
        <span className="font-medium">Mesa {tableData.name}</span>
        <span>•</span>
        <span>Camarero/a: {tableData.server}</span>
      </div>
    </div>
  );
}
