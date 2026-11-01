import { Router } from 'express';

import { verifyJWT } from '../../middlewares/verifyJWT.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { eventIdSchema } from '../events/events.validation.js';

import {
    getEventRegistrationCount,
    getJoinedEvents,
    joinEvent,
    leaveEvent,
} from './eventRegistration.controller.js';

const router = Router();

// Get logged-in user's joined events
router.get('/joined', verifyJWT, getJoinedEvents);

// Get event participants count
router.get(
    '/:id/participants/count',
    validateRequest(eventIdSchema, 'params'),
    getEventRegistrationCount,
);

// Join event
router.post(
    '/:id/join',
    verifyJWT,
    validateRequest(eventIdSchema, 'params'),
    joinEvent,
);

// Leave event
router.delete(
    '/:id/join',
    verifyJWT,
    validateRequest(eventIdSchema, 'params'),
    leaveEvent,
);

export default router;
