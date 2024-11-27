import React from 'react';
import Calendar from 'react-calendar';
import ViewModeSelector from './ViewModeSelector';

interface CalendarCardProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  viewMode: 'daily' | 'weekly' | 'monthly';
  onViewModeChange: (mode: 'daily' | 'weekly' | 'monthly') => void;
}

const CalendarCard: React.FC<CalendarCardProps> = ({
  selectedDate,
  onDateChange,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="bg-radio-blue rounded-xl p-4">
      <h2 className="text-lg font-bold text-radio-text mb-3">Calendário</h2>
      
      <Calendar
        onChange={onDateChange}
        value={selectedDate}
        className="mb-3"
      />

      <div>
        <h3 className="text-sm font-medium text-radio-text-secondary mb-2">
          Visualização
        </h3>
        <ViewModeSelector
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
      </div>
    </div>
  );
};

export default CalendarCard;