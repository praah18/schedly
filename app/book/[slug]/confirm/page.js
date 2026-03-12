'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DateTime } from 'luxon';
import { api } from '../../../../lib/api';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!bookingId) return;
      try {
        const res = await api.getBookingById(bookingId);
        setBooking(res);
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [bookingId]);

  return (
    <div className="card">
      <h1>Booking Confirmed</h1>
      {error && <div className="notice">{error}</div>}
      {booking ? (
        <div style={{ marginTop: 12 }}>
          <p className="badge">{booking.event_name}</p>
          <p style={{ marginTop: 10 }}>
            {DateTime.fromISO(booking.start_time).toLocaleString(DateTime.DATETIME_MED)}
          </p>
          <p style={{ color: 'var(--muted)', marginTop: 6 }}>
            Invitee: {booking.invitee_name} ({booking.invitee_email})
          </p>
        </div>
      ) : (
        <p style={{ marginTop: 12 }}>Loading booking details...</p>
      )}
    </div>
  );
}
