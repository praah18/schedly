'use client';

import { useState } from 'react';

export default function EventTypeForm({ onSubmit, initial, onCancel }) {
  const [name, setName] = useState(initial?.name || '');
  const [durationMinutes, setDurationMinutes] = useState(initial?.duration_minutes || 30);
  const [slug, setSlug] = useState(initial?.slug || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, durationMinutes: Number(durationMinutes), slug: slug || undefined });
    if (!initial) {
      setName('');
      setDurationMinutes(30);
      setSlug('');
    }
  };

  return (
    <form className="card grid" onSubmit={handleSubmit}>
      <div className="input">
        <label>Event name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="input">
        <label>Duration (minutes)</label>
        <input
          type="number"
          min="10"
          max="240"
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(e.target.value)}
          required
        />
      </div>
      <div className="input">
        <label>URL slug (optional)</label>
        <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="coffee-chat" />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn" type="submit">
          {initial ? 'Update Event Type' : 'Create Event Type'}
        </button>
        {onCancel && (
          <button className="btn secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
