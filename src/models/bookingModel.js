import { query } from '../db.js';

export const listBookingsForEventTypeDate = async ({ eventTypeId, startUtc, endUtc }) => {
  const { rows } = await query(
    `SELECT * FROM bookings
     WHERE event_type_id = $1
       AND status = 'booked'
       AND start_time >= $2
       AND start_time < $3
     ORDER BY start_time`,
    [eventTypeId, startUtc, endUtc]
  );
  return rows;
};

export const createBooking = async ({
  eventTypeId,
  userId,
  inviteeName,
  inviteeEmail,
  startUtc,
  endUtc,
  timezone
}) => {
  const { rows } = await query(
    `INSERT INTO bookings
     (event_type_id, user_id, invitee_name, invitee_email, start_time, end_time, timezone, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'booked')
     RETURNING *`,
    [eventTypeId, userId, inviteeName, inviteeEmail, startUtc, endUtc, timezone]
  );
  return rows[0];
};

export const hasOverlap = async ({ eventTypeId, startUtc, endUtc }) => {
  const { rows } = await query(
    `SELECT id FROM bookings
     WHERE event_type_id = $1
       AND status = 'booked'
       AND start_time < $3
       AND end_time > $2
     LIMIT 1`,
    [eventTypeId, startUtc, endUtc]
  );
  return rows.length > 0;
};

export const listMeetings = async ({ status, nowUtc }) => {
  const comparator = status === 'past' ? '<' : '>=';
  const { rows } = await query(
    `SELECT b.*, e.name AS event_name, e.duration_minutes, e.slug
     FROM bookings b
     JOIN event_types e ON e.id = b.event_type_id
     WHERE b.user_id = 1 AND b.status = 'booked' AND b.start_time ${comparator} $1
     ORDER BY b.start_time ${status === 'past' ? 'DESC' : 'ASC'}`,
    [nowUtc]
  );
  return rows;
};

export const cancelMeeting = async (id) => {
  const { rows } = await query(
    `UPDATE bookings
     SET status = 'canceled', canceled_at = NOW()
     WHERE id = $1 AND user_id = 1
     RETURNING *`,
    [id]
  );
  return rows[0];
};

export const getBookingById = async (id) => {
  const { rows } = await query(
    `SELECT b.*, e.name AS event_name, e.duration_minutes, e.slug
     FROM bookings b
     JOIN event_types e ON e.id = b.event_type_id
     WHERE b.id = $1`,
    [id]
  );
  return rows[0];
};
