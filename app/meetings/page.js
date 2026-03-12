'use client';

import { useEffect, useState } from 'react';
import TopNav from '../../components/TopNav';
import MeetingsList from '../../components/MeetingsList';
import { api } from '../../lib/api';

export default function MeetingsPage() {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [upcomingData, pastData] = await Promise.all([
        api.getMeetings('upcoming'),
        api.getMeetings('past')
      ]);
      setUpcoming(upcomingData);
      setPast(pastData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this meeting?')) return;
    await api.cancelMeeting(id);
    load();
  };

  return (
    <div>
      <TopNav />
      <div className="hero">
        <h1>Meetings</h1>
        <p>Track upcoming and past meetings. Cancel any booking with one click.</p>
      </div>
      {error && <div className="notice">{error}</div>}
      <div className="grid grid-2">
        <div>
          <h3 style={{ marginBottom: 12 }}>Upcoming</h3>
          <MeetingsList meetings={upcoming} onCancel={handleCancel} />
        </div>
        <div>
          <h3 style={{ marginBottom: 12 }}>Past</h3>
          <MeetingsList meetings={past} />
        </div>
      </div>
    </div>
  );
}
