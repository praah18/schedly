import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import eventTypeRoutes from './routes/eventTypes.js';
import availabilityRoutes from './routes/availability.js';
import meetingsRoutes from './routes/meetings.js';
import publicRoutes from './routes/public.js';
import { notFound, errorHandler } from './middleware/error.js';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/event-types', eventTypeRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/meetings', meetingsRoutes);
app.use('/api/public', publicRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
