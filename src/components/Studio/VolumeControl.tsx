import React from 'react';
import { FaVolumeUp } from 'react-icons/fa';

interface VolumeControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full h-48 bg-white/5 rounded-lg p-4 flex flex-col items-center justify-between">
        <span className="text-white text-sm font-medium mb-2">{label}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="h-full -rotate-90 w-32"
        />
        <div className="flex items-center mt-2">
          <FaVolumeUp className="text-blue-400 mr-2" />
          <span className="text-white text-sm">
            {Math.round(value * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default VolumeControl;