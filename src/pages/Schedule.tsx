import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { FaPlus, FaEdit, FaTrash, FaMicrophone, FaMusic, FaPray } from 'react-icons/fa';
import { toast } from 'react-toastify';
import CalendarCard from '../components/Schedule/CalendarCard';
import 'react-calendar/dist/Calendar.css';

interface Program {
  id: number;
  name: string;
  presenter: string;
  category: 'music' | 'preaching' | 'testimony' | 'prayer' | 'live';
  targetAudience: string;
  description: string;
  ministerialObjective: string;
  theme: string;
  startDate: Date;
  endDate: Date;
  weekDays: string[];
  startTime: string;
  endTime: string;
  recurrence: 'daily' | 'weekly' | 'monthly' | 'special';
  content: {
    type: 'music' | 'preaching' | 'testimony' | 'jingle' | 'narration';
    items: string[];
  }[];
  isLive: boolean;
}

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [programs, setPrograms] = useState<Program[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const [formData, setFormData] = useState<Partial<Program>>({
    name: '',
    presenter: '',
    category: 'music',
    targetAudience: '',
    description: '',
    ministerialObjective: '',
    theme: '',
    startDate: new Date(),
    endDate: new Date(),
    weekDays: [],
    startTime: '',
    endTime: '',
    recurrence: 'daily',
    content: [],
    isLive: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProgram) {
      // Update existing program
      setPrograms(prev => prev.map(p => 
        p.id === selectedProgram.id ? { ...formData, id: p.id } as Program : p
      ));
      toast.success('Programa atualizado com sucesso!');
    } else {
      // Create new program
      const newProgram = {
        ...formData,
        id: Date.now()
      } as Program;
      setPrograms(prev => [...prev, newProgram]);
      toast.success('Programa criado com sucesso!');
    }
    setShowAddModal(false);
    setSelectedProgram(null);
    setFormData({});
  };

  const deleteProgram = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este programa?')) {
      setPrograms(prev => prev.filter(p => p.id !== id));
      toast.success('Programa excluído com sucesso!');
    }
  };

  return (
    <div className="p-6 bg-radio-dark min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-radio-text mb-2">Programação</h1>
        <p className="text-radio-text-secondary">Gerencie a programação da rádio</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-3">
          <CalendarCard
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>

        {/* Programs List */}
        <div className="lg:col-span-9">
          <div className="bg-radio-blue rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-radio-text">Programas</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-radio-light text-white rounded-lg hover:bg-opacity-80"
              >
                <FaPlus className="mr-2" />
                Novo Programa
              </button>
            </div>

            <div className="space-y-4">
              {programs.map(program => (
                <div
                  key={program.id}
                  className="bg-radio-accent rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        {program.isLive && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-2">
                            AO VIVO
                          </span>
                        )}
                        <h3 className="text-radio-text font-semibold text-lg">{program.name}</h3>
                      </div>
                      <p className="text-radio-text-secondary mt-1">
                        {program.presenter} • {program.startTime} - {program.endTime}
                      </p>
                      <p className="text-radio-text-secondary mt-2">{program.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedProgram(program);
                          setFormData(program);
                          setShowAddModal(true);
                        }}
                        className="p-2 text-radio-text-secondary hover:text-radio-light"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteProgram(program.id)}
                        className="p-2 text-radio-text-secondary hover:text-red-400"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {program.content.map((content, index) => (
                      <span
                        key={index}
                        className="bg-radio-blue px-3 py-1 rounded-full text-sm text-radio-text-secondary"
                      >
                        {content.type === 'music' && <FaMusic className="inline mr-1" />}
                        {content.type === 'preaching' && <FaMicrophone className="inline mr-1" />}
                        {content.type === 'prayer' && <FaPray className="inline mr-1" />}
                        {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {programs.length === 0 && (
                <div className="text-center py-8 text-radio-text-secondary">
                  <p>Nenhum programa cadastrado</p>
                  <p className="text-sm mt-2">Clique em "Novo Programa" para começar</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Program Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-auto py-8">
          <div className="bg-radio-blue rounded-xl p-6 w-full max-w-3xl mx-4">
            <h3 className="text-xl font-bold text-radio-text mb-6">
              {selectedProgram ? 'Editar Programa' : 'Novo Programa'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-radio-text-secondary mb-2">Nome do Programa</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 bg-radio-accent text-radio-text rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-radio-text-secondary mb-2">Apresentador</label>
                  <input
                    type="text"
                    value={formData.presenter}
                    onChange={e => setFormData(prev => ({ ...prev, presenter: e.target.value }))}
                    className="w-full p-2 bg-radio-accent text-radio-text rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-radio-text-secondary mb-2">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full p-2 bg-radio-accent text-radio-text rounded-lg"
                    required
                  >
                    <option value="music">Música</option>
                    <option value="preaching">Pregação</option>
                    <option value="testimony">Testemunho</option>
                    <option value="prayer">Oração</option>
                    <option value="live">Ao Vivo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-radio-text-secondary mb-2">Público-alvo</label>
                  <input
                    type="text"
                    value={formData.targetAudience}
                    onChange={e => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                    className="w-full p-2 bg-radio-accent text-radio-text rounded-lg"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-radio-text-secondary mb-2">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2 bg-radio-accent text-radio-text rounded-lg"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-radio-text-secondary mb-2">Horário Inicial</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={e => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full p-2 bg-radio-accent text-radio-text rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-radio-text-secondary mb-2">Horário Final</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={e => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full p-2 bg-radio-accent text-radio-text rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-radio-text-secondary mb-2">Recorrência</label>
                  <select
                    value={formData.recurrence}
                    onChange={e => setFormData(prev => ({ ...prev, recurrence: e.target.value as any }))}
                    className="w-full p-2 bg-radio-accent text-radio-text rounded-lg"
                    required
                  >
                    <option value="daily">Diário</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                    <option value="special">Especial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-radio-text-secondary mb-2">Transmissão ao Vivo</label>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={formData.isLive}
                      onChange={e => setFormData(prev => ({ ...prev, isLive: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-radio-text-secondary">Programa ao vivo</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedProgram(null);
                    setFormData({});
                  }}
                  className="px-4 py-2 text-radio-text-secondary hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-radio-light text-white rounded-lg hover:bg-opacity-80"
                >
                  {selectedProgram ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;