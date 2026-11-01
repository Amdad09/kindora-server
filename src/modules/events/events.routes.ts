import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { verifyJWT } from '../../middlewares/verifyJWT.js';

import {
    createEventsSchema,
    eventIdSchema,
    eventQuerySchema,
} from './events.validation.js';

import {
    createEvent,
    getEventById,
    getUpcomingEvents,
} from './events.controller.js';

const router = Router();

// Public routes
router.get('/', validateRequest(eventQuerySchema, 'query'), getUpcomingEvents);

router.get('/:id', validateRequest(eventIdSchema, 'params'), getEventById);

// Protected route
router.post('/', verifyJWT, validateRequest(createEventsSchema), createEvent);

export default router;
