import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest.js';

import { createEventsSchema, eventIdSchema, eventQuerySchema } from './events.validation.js';

import { createEvent, getEventById, getUpcomingEvents } from './events.controller.js';

const router = Router();

router.get('/', validateRequest(eventQuerySchema, 'query'), getUpcomingEvents);

router.get('/:id', validateRequest(eventIdSchema, 'params'), getEventById);

router.post('/', validateRequest(createEventsSchema), createEvent);

export default router;
