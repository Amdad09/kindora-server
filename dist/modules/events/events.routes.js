import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { verifyJWT } from '../../middlewares/verifyJWT.js';
import { createEventsSchema, eventIdSchema, eventQuerySchema, updateEventSchema, } from './events.validation.js';
import { createEvent, deleteEvent, getEventById, getMyEvents, getUpcomingEvents, updateEvent, } from './events.controller.js';
const router = Router();
// Public routes
router.get('/', validateRequest(eventQuerySchema, 'query'), getUpcomingEvents);
// Protected: Get authenticated user's events
router.get('/mine', verifyJWT, validateRequest(eventQuerySchema, 'query'), getMyEvents);
// Public: Get single event
router.get('/:id', validateRequest(eventIdSchema, 'params'), getEventById);
// Protected: Create event
router.post('/', verifyJWT, validateRequest(createEventsSchema), createEvent);
router.put('/:id', verifyJWT, validateRequest(eventIdSchema, 'params'), validateRequest(updateEventSchema), updateEvent);
router.delete('/:id', verifyJWT, validateRequest(eventIdSchema, 'params'), deleteEvent);
export default router;
