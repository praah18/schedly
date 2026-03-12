import { query, getClient } from '../db.js';

export const getAvailability = async () => {
  const { rows } = await query(
    'SELECT * FROM availability WHERE user_id = 1 ORDER BY day_of_week, start_time'
  );
  return rows;
};

export const replaceAvailability = async ({ timezone, days }) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM availability WHERE user_id = 1');

    for (const day of days) {
      for (const range of day.ranges) {
        await client.query(
          `INSERT INTO availability (user_id, day_of_week, start_time, end_time, timezone)
           VALUES (1, $1, $2, $3, $4)`,
          [day.dayOfWeek, range.start, range.end, timezone]
        );
      }
    }

    await client.query('UPDATE users SET timezone = $1 WHERE id = 1', [timezone]);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};
