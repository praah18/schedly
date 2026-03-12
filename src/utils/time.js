import { DateTime } from 'luxon';

export const toUtcISO = (dateTimeISO, zone) => {
  return DateTime.fromISO(dateTimeISO, { zone }).toUTC().toISO();
};

export const fromUtcISO = (utcISO, zone) => {
  return DateTime.fromISO(utcISO, { zone: 'utc' }).setZone(zone).toISO();
};

export const getDayOfWeek = (dateISO, zone) => {
  const dt = DateTime.fromISO(dateISO, { zone });
  return dt.weekday % 7; // 0=Sunday
};

export const getDateRangeUtc = (dateISO, zone) => {
  const start = DateTime.fromISO(dateISO, { zone }).startOf('day');
  const end = start.plus({ days: 1 });
  return {
    startUtc: start.toUTC().toISO(),
    endUtc: end.toUTC().toISO()
  };
};
