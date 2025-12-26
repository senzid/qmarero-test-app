'use client';

import Card from './Card';

interface Person {
  id: string;
  name: string;
}

interface PeopleSectionProps {
  people: Person[];
  onAddPerson: () => void;
  onUpdatePersonName: (id: string, name: string) => void;
  onRemovePerson: (id: string) => void;
}

export default function PeopleSection({
  people,
  onAddPerson,
  onUpdatePersonName,
  onRemovePerson,
}: PeopleSectionProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
          Comensales
        </h2>
        <button
          onClick={onAddPerson}
          className="px-3 py-2 text-sm md:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors md:px-4"
        >
          + Agregar persona
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {people.map(person => (
          <div
            key={person.id}
            className="flex items-center gap-3 p-3 rounded-lg"
          >
            <input
              type="text"
              value={person.name}
              onChange={(e) => onUpdatePersonName(person.id, e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {people.length > 1 && (
              <button
                onClick={() => onRemovePerson(person.id)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                title="Eliminar"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

