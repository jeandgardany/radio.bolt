import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { streamService } from '../../services/streamService';
import { RootState } from '../../store';

const StreamControls: React.FC = () => {
  const dispatch = useDispatch();
  const stats = useSelector((state: RootState) => state.radio.stats);

  const startStream = () => {
    streamService.startStream();
  };

  const stopStream = () => {
    streamService.stopStream();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Controles da Transmissão</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Ouvintes:</span>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {stats.listeners}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={startStream}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Iniciar Transmissão
        </button>
        
        <button
          onClick={stopStream}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Parar Transmissão
        </button>
      </div>
    </div>
  );
};

export default StreamControls;