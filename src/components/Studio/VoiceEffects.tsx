import React, { useState } from 'react';
import { FaMagic, FaWaveSquare } from 'react-icons/fa';
import { IoWaterOutline } from 'react-icons/io5';

const VoiceEffects: React.FC = () => {
  const [effects, setEffects] = useState({
    reverb: {
      enabled: false,
      type: 'hall',
      mix: 30,
      decay: 2
    },
    delay: {
      enabled: false,
      time: 0.5,
      feedback: 0.3,
      mix: 25
    },
    compressor: {
      enabled: false,
      threshold: -24,
      ratio: 4,
      attack: 0.003,
      release: 0.25
    }
  });

  const toggleEffect = (effect: string) => {
    setEffects(prev => ({
      ...prev,
      [effect]: {
        ...prev[effect as keyof typeof effects],
        enabled: !prev[effect as keyof typeof effects].enabled
      }
    }));
  };

  const updateEffectParam = (effect: string, param: string, value: number) => {
    setEffects(prev => ({
      ...prev,
      [effect]: {
        ...prev[effect as keyof typeof effects],
        [param]: value
      }
    }));
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center">
        <FaMagic className="mr-2" />
        Efeitos de Voz
      </h2>

      {/* Reverb */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <IoWaterOutline className="text-xl text-blue-400 mr-2" />
            <span className="text-white font-medium">Reverb</span>
          </div>
          <button
            onClick={() => toggleEffect('reverb')}
            className={`px-3 py-1 rounded-full text-sm ${
              effects.reverb.enabled
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-gray-300'
            }`}
          >
            {effects.reverb.enabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Tipo</label>
            <select
              value={effects.reverb.type}
              onChange={(e) => updateEffectParam('reverb', 'type', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
            >
              <option value="hall">Hall</option>
              <option value="room">Room</option>
              <option value="plate">Plate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Mix ({effects.reverb.mix}%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={effects.reverb.mix}
              onChange={(e) => updateEffectParam('reverb', 'mix', Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Delay */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FaWaveSquare className="text-xl text-purple-400 mr-2" />
            <span className="text-white font-medium">Delay</span>
          </div>
          <button
            onClick={() => toggleEffect('delay')}
            className={`px-3 py-1 rounded-full text-sm ${
              effects.delay.enabled
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-gray-300'
            }`}
          >
            {effects.delay.enabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Tempo ({effects.delay.time * 1000}ms)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={effects.delay.time}
              onChange={(e) => updateEffectParam('delay', 'time', Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Feedback ({Math.round(effects.delay.feedback * 100)}%)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={effects.delay.feedback}
              onChange={(e) => updateEffectParam('delay', 'feedback', Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Compressor */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FaWaveSquare className="text-xl text-green-400 mr-2" />
            <span className="text-white font-medium">Compressor</span>
          </div>
          <button
            onClick={() => toggleEffect('compressor')}
            className={`px-3 py-1 rounded-full text-sm ${
              effects.compressor.enabled
                ? 'bg-green-500 text-white'
                : 'bg-white/10 text-gray-300'
            }`}
          >
            {effects.compressor.enabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Threshold ({effects.compressor.threshold}dB)
            </label>
            <input
              type="range"
              min="-60"
              max="0"
              value={effects.compressor.threshold}
              onChange={(e) => updateEffectParam('compressor', 'threshold', Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Ratio ({effects.compressor.ratio}:1)
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={effects.compressor.ratio}
              onChange={(e) => updateEffectParam('compressor', 'ratio', Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceEffects;