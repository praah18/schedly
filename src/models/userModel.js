import { query } from '../db.js';

export const getDefaultUser = async () => {
  const { rows } = await query('SELECT * FROM users WHERE id = 1');
  return rows[0];
};

export const updateTimezone = async (timezone) => {
  const { rows } = await query(
    'UPDATE users SET timezone = $1 WHERE id = 1 RETURNING *',
    [timezone]
  );
  return rows[0];
};
