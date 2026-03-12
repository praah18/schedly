import { asyncHandler } from '../middleware/asyncHandler.js';
import { listMeetings, cancelMeeting, getBookingById } from '../models/bookingModel.js';
import { DateTime } from 'luxon';
import { sendEmail } from '../utils/email.js';

export const listMeetingsHandler = asyncHandler(async (req, res) => {
  const status = req.query.status === 'past' ? 'past' : 'upcoming';
  const nowUtc = DateTime.utc().toISO();
  const meetings = await listMeetings({ status, nowUtc });
  res.json(meetings);
});

export const cancelMeetingHandler = asyncHandler(async (req, res) => {
  const updated = await cancelMeeting(Number(req.params.id));
  if (!updated) {
    res.status(404).json({ message: 'Meeting not found' });
    return;
  }
  try {
    const booking = await getBookingById(Number(req.params.id));
    if (booking) {
      const startLocal = DateTime.fromISO(booking.start_time, { zone: 'utc' })
        .setZone(booking.timezone || 'UTC')
        .toFormat('cccc, LLL dd yyyy • hh:mm a');
      await sendEmail({
        to: booking.invitee_email,
        subject: `Meeting canceled: ${booking.event_name}`,
        text: `Hi ${booking.invitee_name},\n\nYour meeting was canceled.\n\nEvent: ${booking.event_name}\nWhen: ${startLocal} (${booking.timezone || 'UTC'})\n\nThanks,\nSchedly`
      });
    }
  } catch (err) {
    console.warn('Failed to send cancellation email', err);
  }
  res.json(updated);
});
