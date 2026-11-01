import { Router } from 'express';
import { verifyJWT } from '../../middlewares/verifyJWT.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { eventIdSchema } from '../events/events.validation.js';
import { joinEvent } from './eventRegistration.controller.js';

const router = Router();

router.post(
    '/:id/join',
    verifyJWT,
    validateRequest(eventIdSchema, 'params'),
    joinEvent,
);

export default router;
