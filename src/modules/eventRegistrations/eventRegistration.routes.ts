import { Router } from 'express';
import { verifyJWT } from '../../middlewares/verifyJWT.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { eventIdSchema } from '../events/events.validation.js';
import { getEventRegistrationCount, joinEvent, leaveEvent } from './eventRegistration.controller.js';

const router = Router();


router.get(
    '/:id/participants/count',
    validateRequest(eventIdSchema, 'params'),
    getEventRegistrationCount,
);

router.post(
    '/:id/join',
    verifyJWT,
    validateRequest(eventIdSchema, 'params'),
    joinEvent,
);

export default router;

router.delete(
    '/:id/join',
    verifyJWT,
    validateRequest(eventIdSchema, 'params'),
    leaveEvent,
);