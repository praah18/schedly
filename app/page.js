'use client';

import { useEffect, useState } from 'react';
import TopNav from '../components/TopNav';
import EventTypeForm from '../components/EventTypeForm';
import { api } from '../lib/api';

export default function EventTypesPage() {
  const [eventTypes, setEventTypes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await api.getEventTypes();
      setEventTypes(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (payload) => {
    setError('');
    try {
      await api.createEventType(payload);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (payload) => {
    setError('');
    try {
      await api.updateEventType(editing.id, payload);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event type?')) return;
    await api.deleteEventType(id);
    load();
  };

  return (
    <div>
      <TopNav />
      <div className="hero">
        <h1>Event Types</h1>
        <p>Create meeting types and share your unique booking links.</p>
      </div>

      {error && <div className="notice">{error}</div>}

      <div className="grid grid-2">
        <div>
          <EventTypeForm
            initial={editing}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={editing ? () => setEditing(null) : undefined}
          />
        </div>
        <div className="grid">
          {eventTypes.map((event) => (
            <div key={event.id} className="card">
              <div className="section-title">
                <div>
                  <h3>{event.name}</h3>
                  <div className="badge">{event.duration_minutes} min</div>
                </div>
                <button className="btn secondary" onClick={() => setEditing(event)}>
                  Edit
                </button>
              </div>
              <p style={{ color: 'var(--muted)' }}>Booking URL: /book/{event.slug}</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="btn ghost" onClick={() => handleDelete(event.id)}>
                  Delete
                </button>
                <a className="btn" href={`/book/${event.slug}`}>
                  Open Booking Page
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
