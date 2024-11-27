import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Dashboard = () => {
  const stats = useSelector((state: RootState) => state.radio.stats);

  return (
    <div className="p-6 bg-radio-dark min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-radio-text mb-2">Dashboard</h1>
        <p className="text-radio-text-secondary">Visão geral da sua rádio</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ouvintes Ativos"
          value={stats.listeners}
          icon="users"
          color="blue"
        />
        <StatCard
          title="Tempo no Ar"
          value={stats.uptime}
          icon="clock"
          color="green"
        />
        <StatCard
          title="Música Atual"
          value={stats.currentSong}
          icon="music"
          color="purple"
        />
        <StatCard
          title="Próxima Música"
          value={stats.nextSong}
          icon="queue"
          color="orange"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-radio-blue rounded-xl p-6">
          <h2 className="text-xl font-bold text-radio-text mb-4">Controles Rápidos</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="px-4 py-2 bg-radio-light text-white rounded-lg hover:bg-opacity-80">
              Iniciar Transmissão
            </button>
            <button className="px-4 py-2 bg-radio-accent text-white rounded-lg hover:bg-opacity-80">
              Pausar
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-opacity-80">
              Abrir Microfone
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-opacity-80">
              Parar Tudo
            </button>
          </div>
        </div>

        <div className="bg-radio-blue rounded-xl p-6">
          <h2 className="text-xl font-bold text-radio-text mb-4">Programação Atual</h2>
          <div className="space-y-4">
            {stats.schedule?.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-radio-text-secondary">
                <span>{item.time}</span>
                <span>{item.program}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-radio-blue rounded-xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-radio-text-secondary text-sm">{title}</h3>
        <p className="text-2xl font-bold text-radio-text mt-1">{value}</p>
      </div>
      <div className={`text-${color}-400`}>
        {/* Icon would go here */}
      </div>
    </div>
  </div>
);

export default Dashboard;