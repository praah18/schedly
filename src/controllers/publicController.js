import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  getEventTypeBySlug
} from '../models/eventTypeModel.js';
import { getAvailability } from '../models/availabilityModel.js';
import {
  listBookingsForEventTypeDate,
  createBooking,
  hasOverlap,
  getBookingById
} from '../models/bookingModel.js';
import { getDefaultUser } from '../models/userModel.js';
import { validate, bookingSchema } from '../utils/validate.js';
import { buildSlots } from '../utils/slots.js';
import { getDateRangeUtc } from '../utils/time.js';
import { DateTime } from 'luxon';
import { sendEmail } from '../utils/email.js';

export const getPublicEventType = asyncHandler(async (req, res) => {
  const eventType = await getEventTypeBySlug(req.params.slug);
  if (!eventType) {
    res.status(404).json({ message: 'Event type not found' });
    return;
  }
  const availability = await getAvailability();
  const user = await getDefaultUser();
  res.json({
    eventType,
    availability,
    timezone: user?.timezone || 'UTC'
  });
});

export const getAvailableSlots = asyncHandler(async (req, res) => {
  const eventType = await getEventTypeBySlug(req.params.slug);
  if (!eventType) {
    res.status(404).json({ message: 'Event type not found' });
    return;
  }

  const dateISO = req.query.date;
  if (!dateISO) {
    res.status(400).json({ message: 'date query is required (YYYY-MM-DD)' });
    return;
  }

  const user = await getDefaultUser();
  const timezone = user?.timezone || 'UTC';
  const availability = await getAvailability();
  const dayOfWeek = DateTime.fromISO(dateISO, { zone: timezone }).weekday % 7;
  const dayAvailability = availability.filter((a) => a.day_of_week === dayOfWeek);

  const rawSlots = buildSlots({
    dateISO,
    availability: dayAvailability,
    durationMinutes: eventType.duration_minutes,
    zone: timezone
  });

  const { startUtc, endUtc } = getDateRangeUtc(dateISO, timezone);
  const bookings = await listBookingsForEventTypeDate({
    eventTypeId: eventType.id,
    startUtc,
    endUtc
  });

  const bookedStarts = new Set(bookings.map((b) => DateTime.fromISO(b.start_time).toUTC().toISO()));
  const slots = rawSlots.filter((slot) => !bookedStarts.has(DateTime.fromISO(slot.start).toUTC().toISO()));

  res.json({
    date: dateISO,
    timezone,
    slots
  });
});

export const createPublicBooking = asyncHandler(async (req, res) => {
  const eventType = await getEventTypeBySlug(req.params.slug);
  if (!eventType) {
    res.status(404).json({ message: 'Event type not found' });
    return;
  }

  const user = await getDefaultUser();
  const timezone = user?.timezone || 'UTC';

  const data = validate(bookingSchema, req.body);
  const startUtc = DateTime.fromISO(data.start).toUTC().toISO();
  const endUtc = DateTime.fromISO(data.start)
    .plus({ minutes: eventType.duration_minutes })
    .toUTC()
    .toISO();

  const overlap = await hasOverlap({
    eventTypeId: eventType.id,
    startUtc,
    endUtc
  });

  if (overlap) {
    res.status(409).json({ message: 'This time slot is already booked' });
    return;
  }

  const booking = await createBooking({
    eventTypeId: eventType.id,
    userId: eventType.user_id,
    inviteeName: data.name,
    inviteeEmail: data.email,
    startUtc,
    endUtc,
    timezone
  });

  try {
    const startLocal = DateTime.fromISO(startUtc, { zone: 'utc' })
      .setZone(timezone)
      .toFormat('cccc, LLL dd yyyy • hh:mm a');
    await sendEmail({
      to: data.email,
      subject: `Booking confirmed: ${eventType.name}`,
      text: `Hi ${data.name},\n\nYour meeting is booked.\n\nEvent: ${eventType.name}\nWhen: ${startLocal} (${timezone})\n\nThanks,\nSchedly`
    });
  } catch (err) {
    console.warn('Failed to send confirmation email', err);
  }

  res.status(201).json(booking);
});

export const getPublicBookingById = asyncHandler(async (req, res) => {
  const booking = await getBookingById(Number(req.params.id));
  if (!booking) {
    res.status(404).json({ message: 'Booking not found' });
    return;
  }
  res.json(booking);
});
