import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest.js';

import { createEventsSchema, eventQuerySchema } from './events.validation.js';

import { createEvent, getUpcomingEvents } from './events.controller.js';

const router = Router();

router.get('/', validateRequest(eventQuerySchema, 'query'), getUpcomingEvents);

router.post('/', validateRequest(createEventsSchema), createEvent);

export default router;
