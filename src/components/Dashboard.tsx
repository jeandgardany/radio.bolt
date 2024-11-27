import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Dashboard = () => {
  const stats = useSelector((state: RootState) => state.radio.stats);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ouvintes Ativos"
          value={stats.listeners}
          icon="users"
        />
        <StatCard
          title="Tempo no Ar"
          value={stats.uptime}
          icon="clock"
        />
        <StatCard
          title="Música Atual"
          value={stats.currentSong}
          icon="music"
        />
        <StatCard
          title="Próxima Música"
          value={stats.nextSong}
          icon="queue"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Controles Rápidos</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="btn btn-primary">Iniciar Transmissão</button>
            <button className="btn btn-secondary">Pausar</button>
            <button className="btn btn-success">Abrir Microfone</button>
            <button className="btn btn-danger">Parar Tudo</button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Programação Atual</h2>
          <div className="space-y-4">
            {stats.schedule.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
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

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="text-blue-500">
        {/* Icon component would go here */}
      </div>
    </div>
  </div>
);

export default Dashboard;