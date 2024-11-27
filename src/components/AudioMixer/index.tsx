import React, { useState } from 'react';
import VolumeControl from './VolumeControl';
import EqualizerBand from './EqualizerBand';
import AudioEffects from '../AudioEffects';

const AudioMixer: React.FC = () => {
  const [volumes, setVolumes] = useState({
    master: 1,
    music: 1,
    mic: 1,
    jingles: 1
  });

  const [eq, setEq] = useState({
    bass: 0,
    lowMid: 0,
    mid: 0,
    highMid: 0,
    treble: 0
  });

  const handleVolumeChange = (channel: string, value: number) => {
    setVolumes(prev => ({ ...prev, [channel]: value }));
  };

  const handleEqChange = (band: string, value: number) => {
    setEq(prev => ({ ...prev, [band]: value }));
  };

  const handleEffectChange = (effect: string, value: number) => {
    // Implementar lógica de efeitos
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6">Canais de Volume</h2>
        <div className="space-y-6">
          {Object.entries(volumes).map(([channel, value]) => (
            <VolumeControl
              key={channel}
              label={channel.charAt(0).toUpperCase() + channel.slice(1)}
              value={value}
              onChange={(val) => handleVolumeChange(channel, val)}
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6">Equalizador</h2>
        <div className="flex justify-between items-end">
          {Object.entries(eq).map(([band, value]) => (
            <EqualizerBand
              key={band}
              frequency={band}
              gain={value}
              onChange={(val) => handleEqChange(band, val)}
            />
          ))}
        </div>
      </div>

      <AudioEffects onEffectChange={handleEffectChange} />
    </div>
  );
};

export default AudioMixer;