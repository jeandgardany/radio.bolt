import React from 'react';

interface VolumeControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <span className="text-xs text-gray-500 text-right">
        {Math.round(value * 100)}%
      </span>
    </div>
  );
};

export default VolumeControl;