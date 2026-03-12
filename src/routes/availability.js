import { Router } from 'express';
import {
  getAvailabilityHandler,
  updateAvailabilityHandler
} from '../controllers/availabilityController.js';

const router = Router();

router.get('/', getAvailabilityHandler);
router.put('/', updateAvailabilityHandler);

export default router;
