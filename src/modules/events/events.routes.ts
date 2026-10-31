import { Router } from 'express';
import { validRequest } from '../../middlewares/validateRequest.js';
import { createEventsSchema } from './events.validation.js';
import { createEvent, getUpcomingEvents } from './events.controller.js';

const router = Router();

router.post('/', validRequest(createEventsSchema), createEvent)
router.get('/', getUpcomingEvents);


export default router;
