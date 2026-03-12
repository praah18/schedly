import { Router } from 'express';
import {
  getEventTypes,
  createEventTypeHandler,
  updateEventTypeHandler,
  deleteEventTypeHandler,
  getEventTypeByIdHandler
} from '../controllers/eventTypeController.js';

const router = Router();

router.get('/', getEventTypes);
router.get('/:id', getEventTypeByIdHandler);
router.post('/', createEventTypeHandler);
router.put('/:id', updateEventTypeHandler);
router.delete('/:id', deleteEventTypeHandler);

export default router;
