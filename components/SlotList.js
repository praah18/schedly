'use client';

import { DateTime } from 'luxon';

export default function SlotList({ slots, timezone, selected, onSelect }) {
  if (!slots || slots.length === 0) {
    return <div className="notice">No available slots for this day.</div>;
  }

  return (
    <div className="slot-list">
      {slots.map((slot) => {
        const label = DateTime.fromISO(slot.start, { zone: timezone }).toFormat('hh:mm a');
        const isSelected = selected?.start === slot.start;
        return (
          <button
            key={slot.start}
            type="button"
            className={`slot ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(slot)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
