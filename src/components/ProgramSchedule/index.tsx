import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface Program {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  type: 'music' | 'live' | 'replay';
}

const ProgramSchedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [programs, setPrograms] = useState<Program[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const addProgram = (program: Omit<Program, 'id'>) => {
    setPrograms(prev => [...prev, { ...program, id: Date.now() }]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Programação do Dia</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Adicionar Programa
          </button>
        </div>

        <div className="space-y-4">
          {programs.map(program => (
            <div
              key={program.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-medium">{program.name}</h3>
                <p className="text-sm text-gray-500">
                  {program.startTime} - {program.endTime}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  program.type === 'live'
                    ? 'bg-red-100 text-red-800'
                    : program.type === 'music'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {program.type === 'live' ? 'Ao Vivo' : 
                 program.type === 'music' ? 'Música' : 'Reprise'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default ProgramSchedule;