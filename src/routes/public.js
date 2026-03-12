import { Router } from 'express';
import {
  getPublicEventType,
  getAvailableSlots,
  createPublicBooking,
  getPublicBookingById
} from '../controllers/publicController.js';

const router = Router();

router.get('/event-types/:slug', getPublicEventType);
router.get('/availability/:slug', getAvailableSlots);
router.post('/bookings/:slug', createPublicBooking);
router.get('/bookings/id/:id', getPublicBookingById);

export default router;
