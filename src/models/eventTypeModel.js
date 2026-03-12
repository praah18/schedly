import { query } from '../db.js';

const slugify = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

export const listEventTypes = async () => {
  const { rows } = await query(
    'SELECT * FROM event_types WHERE user_id = 1 ORDER BY created_at DESC'
  );
  return rows;
};

export const getEventTypeById = async (id) => {
  const { rows } = await query(
    'SELECT * FROM event_types WHERE id = $1 AND user_id = 1',
    [id]
  );
  return rows[0];
};

export const getEventTypeBySlug = async (slug) => {
  const { rows } = await query(
    'SELECT * FROM event_types WHERE slug = $1 AND user_id = 1',
    [slug]
  );
  return rows[0];
};

export const createEventType = async ({ name, durationMinutes, slug }) => {
  const finalSlug = slug ? slugify(slug) : slugify(name);

  const existing = await getEventTypeBySlug(finalSlug);
  if (existing) {
    const err = new Error('Slug already exists');
    err.status = 400;
    throw err;
  }

  const { rows } = await query(
    `INSERT INTO event_types (user_id, name, duration_minutes, slug)
     VALUES (1, $1, $2, $3)
     RETURNING *`,
    [name, durationMinutes, finalSlug]
  );
  return rows[0];
};

export const updateEventType = async (id, { name, durationMinutes, slug }) => {
  const existing = await getEventTypeById(id);
  if (!existing) {
    const err = new Error('Event type not found');
    err.status = 404;
    throw err;
  }

  const finalSlug = slug ? slugify(slug) : existing.slug;

  if (finalSlug !== existing.slug) {
    const duplicate = await getEventTypeBySlug(finalSlug);
    if (duplicate) {
      const err = new Error('Slug already exists');
      err.status = 400;
      throw err;
    }
  }

  const { rows } = await query(
    `UPDATE event_types
     SET name = $1, duration_minutes = $2, slug = $3
     WHERE id = $4 AND user_id = 1
     RETURNING *`,
    [name, durationMinutes, finalSlug, id]
  );
  return rows[0];
};

export const deleteEventType = async (id) => {
  await query('DELETE FROM event_types WHERE id = $1 AND user_id = 1', [id]);
};
