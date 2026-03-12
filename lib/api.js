const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const handleResponse = async (res) => {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const message = data.message || 'Request failed';
    throw new Error(message);
  }
  return res.json();
};

export const api = {
  getEventTypes: () => fetch(`${API_URL}/api/event-types`).then(handleResponse),
  createEventType: (payload) =>
    fetch(`${API_URL}/api/event-types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(handleResponse),
  updateEventType: (id, payload) =>
    fetch(`${API_URL}/api/event-types/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(handleResponse),
  deleteEventType: (id) =>
    fetch(`${API_URL}/api/event-types/${id}`, { method: 'DELETE' }),

  getAvailability: () => fetch(`${API_URL}/api/availability`).then(handleResponse),
  updateAvailability: (payload) =>
    fetch(`${API_URL}/api/availability`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(handleResponse),

  getPublicEventType: (slug) =>
    fetch(`${API_URL}/api/public/event-types/${slug}`).then(handleResponse),
  getAvailableSlots: (slug, date) =>
    fetch(`${API_URL}/api/public/availability/${slug}?date=${date}`).then(handleResponse),
  createBooking: (slug, payload) =>
    fetch(`${API_URL}/api/public/bookings/${slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(handleResponse),
  getBookingById: (id) =>
    fetch(`${API_URL}/api/public/bookings/id/${id}`).then(handleResponse),

  getMeetings: (status) =>
    fetch(`${API_URL}/api/meetings?status=${status}`).then(handleResponse),
  cancelMeeting: (id) =>
    fetch(`${API_URL}/api/meetings/${id}/cancel`, { method: 'POST' }).then(handleResponse)
};
