import { Router } from 'express';
import {
  listMeetingsHandler,
  cancelMeetingHandler
} from '../controllers/meetingsController.js';

const router = Router();

router.get('/', listMeetingsHandler);
router.post('/:id/cancel', cancelMeetingHandler);

export default router;
