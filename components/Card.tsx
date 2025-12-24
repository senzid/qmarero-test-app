import { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = '' }: CardProps) {
  return (
    <section className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </section>
  );
}

