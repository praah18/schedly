import { DateTime } from 'luxon';

export const buildSlots = ({ dateISO, availability, durationMinutes, zone }) => {
  const slots = [];

  for (const row of availability) {
    const start = DateTime.fromISO(`${dateISO}T${row.start_time}`, { zone });
    const end = DateTime.fromISO(`${dateISO}T${row.end_time}`, { zone });

    let cursor = start;
    while (cursor.plus({ minutes: durationMinutes }) <= end) {
      const slotStart = cursor;
      const slotEnd = cursor.plus({ minutes: durationMinutes });
      slots.push({
        start: slotStart.toISO(),
        end: slotEnd.toISO()
      });
      cursor = cursor.plus({ minutes: durationMinutes });
    }
  }

  return slots;
};
