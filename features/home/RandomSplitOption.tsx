'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SelectedOption {
  path: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
}

export default function RandomSplitOption() {
  const router = useRouter();
  const [isSelecting, setIsSelecting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectedOption | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const options: SelectedOption[] = [
    {
      path: '/split-equal',
      title: 'Dividir por igual',
      description: 'Divide el total de la cuenta entre todos los comensales. Todos pagan la misma cantidad.',
      emoji: '⚖️',
      color: 'green'
    },
    {
      path: '/split-bill',
      title: 'Cada uno lo suyo',
      description: 'Asigna cada item de la cuenta a las personas que lo consumieron. Pago personalizado por persona.',
      emoji: '🍽️',
      color: 'blue'
    }
  ];

  const handleRandomSelection = () => {
    setIsSelecting(true);
    
    const randomOption = options[Math.floor(Math.random() * options.length)];
    
    setTimeout(() => {
      setIsSelecting(false);
      setSelectedOption(randomOption);
      setShowModal(true);
      setTimeout(() => setIsAnimating(true), 10);
    }, 1000);
  };

  const handleConfirm = () => {
    if (selectedOption) {
      router.push(selectedOption.path);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedOption(null);
    setIsAnimating(false);
  };

  return (
    <>
      <button
        onClick={handleRandomSelection}
        disabled={isSelecting}
        className="group w-full p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 hover:cursor-pointer"
      >
        <span className="text-3xl">
          {isSelecting ? '⏳' : '🎲'}
        </span>
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold text-slate-900 group-hover:text-purple-600 transition-colors md:text-start">
            {isSelecting ? 'Seleccionando...' : 'Escoger de forma aleatoria'}
          </h3>
          <p className="text-sm text-slate-500">
            Escogemos por vosotros una de las opciones para que no tengas que decidir.
          </p>
        </div>
      </button>

      {showModal && selectedOption && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={handleCancel}
        >
          <div 
            className={`bg-white rounded-xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300 ${
              isAnimating 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-4 scale-95'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div onClick={handleConfirm} className="text-center hover:cursor-pointer">
              <div className="mb-4 text-6xl">
                {selectedOption.emoji}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                ¡Método seleccionado!
              </h3>
              <p className="text-lg font-semibold text-slate-700 mb-4">
                {selectedOption.title}
              </p>
              <p className="text-slate-600">
                {selectedOption.description}
              </p>
              
                
                <div className="mt-6 inline-flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                  Continuar
                  <span className="ml-2">→</span>
                </div>
                
            </div>
          </div>
        </div>
      )}
    </>
  );
}

