import { z } from 'zod';

export const validate = (schema, data) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const message = result.error.errors.map((e) => e.message).join(', ');
    const err = new Error(message);
    err.status = 400;
    throw err;
  }
  return result.data;
};

export const eventTypeSchema = z.object({
  name: z.string().min(1),
  durationMinutes: z.number().int().min(10).max(240),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/i).optional()
});

export const availabilitySchema = z.object({
  timezone: z.string().min(1),
  days: z.array(
    z.object({
      dayOfWeek: z.number().int().min(0).max(6),
      ranges: z.array(
        z.object({
          start: z.string().regex(/^\d{2}:\d{2}$/),
          end: z.string().regex(/^\d{2}:\d{2}$/)
        })
      ).min(1)
    })
  )
});

export const bookingSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  start: z.string().min(1)
});
