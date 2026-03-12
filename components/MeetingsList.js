'use client';

import { DateTime } from 'luxon';

export default function MeetingsList({ meetings, onCancel }) {
  if (!meetings || meetings.length === 0) {
    return <div className="notice">No meetings found.</div>;
  }

  return (
    <div className="grid">
      {meetings.map((meeting) => (
        <div key={meeting.id} className="card">
          <h3>{meeting.event_name}</h3>
          <p style={{ color: 'var(--muted)', marginTop: 6 }}>
            {DateTime.fromISO(meeting.start_time).toLocaleString(DateTime.DATETIME_MED)}
          </p>
          <p style={{ color: 'var(--muted)', marginTop: 6 }}>
            Invitee: {meeting.invitee_name} ({meeting.invitee_email})
          </p>
          {onCancel && (
            <button className="btn danger" style={{ marginTop: 12 }} onClick={() => onCancel(meeting.id)}>
              Cancel Meeting
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
