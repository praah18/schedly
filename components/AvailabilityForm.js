'use client';

import { useState } from 'react';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const timezoneOptions = [
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Australia/Sydney'
];

const buildInitialDays = (availability) => {
  if (!availability || availability.length === 0) {
    return dayNames.map((_, idx) => ({
      dayOfWeek: idx,
      enabled: idx >= 1 && idx <= 5,
      ranges: idx >= 1 && idx <= 5 ? [{ start: '09:00', end: '17:00' }] : []
    }));
  }

  return dayNames.map((_, idx) => {
    const ranges = availability
      .filter((row) => row.day_of_week === idx)
      .map((row) => ({ start: row.start_time.slice(0, 5), end: row.end_time.slice(0, 5) }));
    return {
      dayOfWeek: idx,
      enabled: ranges.length > 0,
      ranges: ranges.length ? ranges : []
    };
  });
};

export default function AvailabilityForm({ initialTimezone, availability, onSave }) {
  const [timezone, setTimezone] = useState(initialTimezone || 'UTC');
  const [days, setDays] = useState(buildInitialDays(availability));

  const toggleDay = (dayIdx) => {
    setDays((prev) =>
      prev.map((day) =>
        day.dayOfWeek === dayIdx
          ? { ...day, enabled: !day.enabled, ranges: day.enabled ? [] : [{ start: '09:00', end: '17:00' }] }
          : day
      )
    );
  };

  const updateRange = (dayIdx, rangeIdx, field, value) => {
    setDays((prev) =>
      prev.map((day) => {
        if (day.dayOfWeek !== dayIdx) return day;
        const ranges = day.ranges.map((range, idx) =>
          idx === rangeIdx ? { ...range, [field]: value } : range
        );
        return { ...day, ranges };
      })
    );
  };

  const addRange = (dayIdx) => {
    setDays((prev) =>
      prev.map((day) =>
        day.dayOfWeek === dayIdx
          ? { ...day, ranges: [...day.ranges, { start: '13:00', end: '17:00' }] }
          : day
      )
    );
  };

  const removeRange = (dayIdx, rangeIdx) => {
    setDays((prev) =>
      prev.map((day) => {
        if (day.dayOfWeek !== dayIdx) return day;
        const ranges = day.ranges.filter((_, idx) => idx !== rangeIdx);
        return { ...day, ranges, enabled: ranges.length > 0 };
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      timezone,
      days: days
        .filter((day) => day.enabled && day.ranges.length)
        .map((day) => ({
          dayOfWeek: day.dayOfWeek,
          ranges: day.ranges
        }))
    };
    onSave(payload);
  };

  return (
    <form className="card grid" onSubmit={handleSubmit}>
      <div className="input">
        <label>Timezone</label>
        <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
          {timezoneOptions.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      <div className="grid">
        {days.map((day) => (
          <div key={day.dayOfWeek} className="card" style={{ boxShadow: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{dayNames[day.dayOfWeek]}</strong>
              <button className="btn secondary" type="button" onClick={() => toggleDay(day.dayOfWeek)}>
                {day.enabled ? 'Disable' : 'Enable'}
              </button>
            </div>

            {day.enabled && (
              <div className="grid" style={{ marginTop: 12 }}>
                {day.ranges.map((range, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input
                      type="time"
                      value={range.start}
                      onChange={(e) => updateRange(day.dayOfWeek, idx, 'start', e.target.value)}
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={range.end}
                      onChange={(e) => updateRange(day.dayOfWeek, idx, 'end', e.target.value)}
                    />
                    <button
                      className="btn ghost"
                      type="button"
                      onClick={() => removeRange(day.dayOfWeek, idx)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button className="btn secondary" type="button" onClick={() => addRange(day.dayOfWeek)}>
                  Add time range
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="btn" type="submit">
        Save Availability
      </button>
    </form>
  );
}
