'use client';

import { DateTime } from 'luxon';

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar({ selectedDate, onSelectDate }) {
  const current = selectedDate ? DateTime.fromISO(selectedDate) : DateTime.now();
  const monthStart = current.startOf('month');
  const monthEnd = current.endOf('month');

  const startWeekday = monthStart.weekday % 7;
  const daysInMonth = monthEnd.day;

  const cells = [];

  for (let i = 0; i < startWeekday; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(monthStart.set({ day }).toISODate());
  }

  const prevMonth = monthStart.minus({ months: 1 }).toISODate();
  const nextMonth = monthStart.plus({ months: 1 }).toISODate();

  return (
    <div className="card" style={{ boxShadow: 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <button className="btn secondary" type="button" onClick={() => onSelectDate(prevMonth)}>
          Prev
        </button>
        <strong>{monthStart.toFormat('MMMM yyyy')}</strong>
        <button className="btn secondary" type="button" onClick={() => onSelectDate(nextMonth)}>
          Next
        </button>
      </div>
      <div className="calendar">
        {weekdayLabels.map((label) => (
          <div key={label} className="calendar-day disabled">
            {label}
          </div>
        ))}
        {cells.map((value, idx) => {
          if (!value) {
            return <div key={`empty-${idx}`} className="calendar-day disabled" />;
          }
          const selected = value === selectedDate;
          return (
            <button
              key={value}
              type="button"
              className={`calendar-day ${selected ? 'selected' : ''}`}
              onClick={() => onSelectDate(value)}
            >
              {DateTime.fromISO(value).day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
