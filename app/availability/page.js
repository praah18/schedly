'use client';

import { useEffect, useState } from 'react';
import TopNav from '../../components/TopNav';
import AvailabilityForm from '../../components/AvailabilityForm';
import { api } from '../../lib/api';

export default function AvailabilityPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const load = async () => {
    try {
      const res = await api.getAvailability();
      setData(res);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (payload) => {
    setError('');
    setSaved(false);
    try {
      const res = await api.updateAvailability(payload);
      setData(res);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <TopNav />
      <div className="hero">
        <h1>Availability</h1>
        <p>Set the hours when you are open for meetings.</p>
      </div>
      {error && <div className="notice">{error}</div>}
      {saved && <div className="notice">Availability saved!</div>}
      {data && (
        <AvailabilityForm
          initialTimezone={data.timezone}
          availability={data.availability}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
