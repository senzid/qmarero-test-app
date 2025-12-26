import Link from 'next/link';

export default function BackButton({ goBackHref }: { goBackHref: string }) {
  
  return (
    <Link
      href={goBackHref}
      className="flex items-center justify-center w-8 h-8 rounded-full bg-white hover:bg-slate-100 transition-colors shadow-sm border border-slate-200 md:w-10 md:h-10"
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
  );
}

