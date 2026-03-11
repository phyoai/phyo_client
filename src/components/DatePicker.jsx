'use client';

import React, { useState } from 'react';
import { ChevronLeftLine, ChevronRightLine } from '@phyoofficial/phyo-icon-library';

/**
 * DatePicker Component - Date selection component with calendar
 */

const DatePicker = React.forwardRef(({
  value,
  onChange,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (day) => {
    if (day) {
      const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      onChange?.(selectedDate);
      setIsOpen(false);
    }
  };

  const formattedDate = value
    ? value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Select date';

  return (
    <div className={`relative ${className}`} {...props}>
      <button
        ref={ref}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full
          px-4 py-2
          rounded-lg
          border border-neutral-muted
          bg-white
          text-text-base
          font-medium
          transition-all
          hover:border-brand-base
          focus:outline-none
          focus:ring-2
          focus:ring-brand-base/20
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        `}
      >
        {formattedDate}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-neutral-muted rounded-lg shadow-lg p-4 z-10 w-72">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-base">{monthName}</h3>
            <div className="flex gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-1 hover:bg-neutral-muted rounded transition-colors"
              >
                <ChevronLeftLine width={20} height={20} />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 hover:bg-neutral-muted rounded transition-colors"
              >
                <ChevronRightLine width={20} height={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-text-muted py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(day)}
                disabled={!day}
                className={`
                  p-2 text-sm rounded
                  transition-all
                  ${!day ? 'invisible' : ''}
                  ${day === value?.getDate() && currentMonth.getMonth() === value.getMonth()
                    ? 'bg-brand-base text-white font-semibold'
                    : 'hover:bg-accent-base text-text-base'
                  }
                `}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
