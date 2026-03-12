'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DateTime } from 'luxon';
import Calendar from '../../../components/Calendar';
import SlotList from '../../../components/SlotList';
import { api } from '../../../lib/api';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [eventType, setEventType] = useState(null);
  const [timezone, setTimezone] = useState('UTC');
  const [selectedDate, setSelectedDate] = useState(DateTime.now().toISODate());
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);

  const loadEvent = async () => {
    try {
      const res = await api.getPublicEventType(slug);
      setEventType(res.eventType);
      setTimezone(res.timezone || 'UTC');
    } catch (err) {
      setError(err.message);
    }
  };

  const loadSlots = async (dateISO) => {
    setLoadingSlots(true);
    try {
      const res = await api.getAvailableSlots(slug, dateISO);
      setSlots(res.slots || []);
      setSelectedSlot(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    if (slug) {
      loadEvent();
    }
  }, [slug]);

  useEffect(() => {
    if (slug && selectedDate) {
      loadSlots(selectedDate);
    }
  }, [slug, selectedDate]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');
    if (!selectedSlot) {
      setError('Select a time slot first.');
      return;
    }
    try {
      const booking = await api.createBooking(slug, {
        name,
        email,
        start: selectedSlot.start
      });
      router.push(`/book/${slug}/confirm?bookingId=${booking.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="hero">
        <h1>{eventType ? eventType.name : 'Booking'}</h1>
        <p>
          {eventType ? `${eventType.duration_minutes} minutes` : ''}
          {eventType ? ` • Timezone: ${timezone}` : ''}
        </p>
      </div>

      {error && <div className="notice">{error}</div>}

      <div className="grid grid-2 booking-grid">
        <div>
          <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>
        <div className="card" style={{ boxShadow: 'none' }}>
          <h3>Available Times</h3>
          {loadingSlots ? <div className="notice">Loading slots...</div> : null}
          <SlotList
            slots={slots}
            timezone={timezone}
            selected={selectedSlot}
            onSelect={setSelectedSlot}
          />
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3>Book this meeting</h3>
        <form className="grid" onSubmit={handleBooking}>
          <div className="input">
            <label>Your name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="input">
            <label>Your email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button className="btn" type="submit">Confirm Booking</button>
        </form>
        {selectedSlot && (
          <p style={{ marginTop: 12, color: 'var(--muted)' }}>
            Selected time: {DateTime.fromISO(selectedSlot.start, { zone: timezone }).toFormat('cccc, LLL dd • hh:mm a')}
          </p>
        )}
      </div>
    </div>
  );
}
