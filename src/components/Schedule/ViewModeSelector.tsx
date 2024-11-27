import React from 'react';

interface ViewModeSelectorProps {
  viewMode: 'daily' | 'weekly' | 'monthly';
  onViewModeChange: (mode: 'daily' | 'weekly' | 'monthly') => void;
}

const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({ viewMode, onViewModeChange }) => {
  const modes = [
    { value: 'daily', label: 'Dia' },
    { value: 'weekly', label: 'Semana' },
    { value: 'monthly', label: 'Mês' }
  ] as const;

  return (
    <div className="flex gap-1">
      {modes.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onViewModeChange(value)}
          className={`flex-1 px-2 py-1 text-xs rounded-md transition-colors ${
            viewMode === value
              ? 'bg-radio-light text-white'
              : 'bg-radio-accent text-radio-text-secondary hover:bg-opacity-80'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default ViewModeSelector;