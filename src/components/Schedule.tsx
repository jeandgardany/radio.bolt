import React, { useState } from 'react';

interface Program {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  type: 'music' | 'live' | 'replay';
}

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [programs, setPrograms] = useState<Program[]>([]);

  const addProgram = () => {
    // Lógica para adicionar novo programa
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Programação</h1>
        
        <button
          onClick={addProgram}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Novo Programa
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="lg:col-span-5 bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            {programs.map((program) => (
              <div
                key={program.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-semibold">{program.name}</h3>
                  <p className="text-sm text-gray-500">
                    {program.startTime} - {program.endTime}
                  </p>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-sm ${
                  program.type === 'live' ? 'bg-red-100 text-red-800' :
                  program.type === 'music' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {program.type === 'live' ? 'Ao Vivo' :
                   program.type === 'music' ? 'Música' : 'Reprise'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Calendário</h2>
          {/* Componente de calendário será implementado aqui */}
        </div>
      </div>
    </div>
  );
};

export default Schedule;