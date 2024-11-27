import React from 'react';

interface EqualizerBandProps {
  frequency: string;
  gain: number;
  onChange: (value: number) => void;
}

const EqualizerBand: React.FC<EqualizerBandProps> = ({ frequency, gain, onChange }) => {
  return (
    <div className="flex flex-col items-center">
      <input
        type="range"
        min="-12"
        max="12"
        step="1"
        value={gain}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="h-32 -rotate-90"
      />
      <span className="text-white text-sm mt-4">{frequency}</span>
      <span className="text-blue-400 text-xs">{gain}dB</span>
    </div>
  );
};

export default EqualizerBand;