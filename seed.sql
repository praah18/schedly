INSERT INTO users (id, name, email, timezone)
VALUES (1, 'Alex Johnson', 'alex@example.com', 'America/New_York')
ON CONFLICT (id) DO NOTHING;

INSERT INTO event_types (user_id, name, duration_minutes, slug)
VALUES
  (1, '30 Minute Meeting', 30, '30-minute-meeting'),
  (1, '60 Minute Meeting', 60, '60-minute-meeting'),
  (1, 'Coffee Chat', 15, 'coffee-chat')
ON CONFLICT (slug) DO NOTHING;

DELETE FROM availability WHERE user_id = 1;

INSERT INTO availability (user_id, day_of_week, start_time, end_time, timezone)
VALUES
  (1, 1, '09:00', '12:00', 'America/New_York'),
  (1, 1, '13:00', '17:00', 'America/New_York'),
  (1, 2, '09:00', '17:00', 'America/New_York'),
  (1, 3, '09:00', '17:00', 'America/New_York'),
  (1, 4, '10:00', '16:00', 'America/New_York'),
  (1, 5, '09:00', '12:00', 'America/New_York');

INSERT INTO bookings (event_type_id, user_id, invitee_name, invitee_email, start_time, end_time, timezone, status)
VALUES
  ((SELECT id FROM event_types WHERE slug = '30-minute-meeting'), 1, 'Jamie Rivera', 'jamie@example.com', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 30 minutes', 'America/New_York', 'booked'),
  ((SELECT id FROM event_types WHERE slug = 'coffee-chat'), 1, 'Chris Lee', 'chris@example.com', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days -15 minutes', 'America/New_York', 'booked');
