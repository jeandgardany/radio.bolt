import React, { useState } from 'react';

interface AudioEffectsProps {
  onEffectChange: (effect: string, value: number) => void;
}

const AudioEffects: React.FC<AudioEffectsProps> = ({ onEffectChange }) => {
  const [effects, setEffects] = useState({
    reverb: 0,
    echo: 0,
    compression: 0
  });

  const handleEffectChange = (effect: string, value: number) => {
    setEffects(prev => ({ ...prev, [effect]: value }));
    onEffectChange(effect, value);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6">Efeitos de Áudio</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Reverb</label>
          <select 
            value={effects.reverb}
            onChange={(e) => handleEffectChange('reverb', Number(e.target.value))}
            className="w-full border rounded-lg p-2"
          >
            <option value="0">Desligado</option>
            <option value="1">Sala Pequena</option>
            <option value="2">Sala Média</option>
            <option value="3">Sala Grande</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Echo</label>
          <input
            type="range"
            min="0"
            max="100"
            value={effects.echo}
            onChange={(e) => handleEffectChange('echo', Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Compressor</label>
          <input
            type="range"
            min="0"
            max="100"
            value={effects.compression}
            onChange={(e) => handleEffectChange('compression', Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioEffects;