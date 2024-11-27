import React from 'react';

interface EqualizerBandProps {
  frequency: string;
  gain: number;
  onChange: (value: number) => void;
}

const EqualizerBand: React.FC<EqualizerBandProps> = ({ frequency, gain, onChange }) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <input
        type="range"
        min="-12"
        max="12"
        step="1"
        value={gain}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="h-32 -rotate-90"
      />
      <span className="text-sm font-medium">{frequency}</span>
      <span className="text-xs text-gray-500">{gain}dB</span>
    </div>
  );
};

export default EqualizerBand;