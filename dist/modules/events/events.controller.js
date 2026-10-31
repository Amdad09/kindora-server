import { createEventService, getUpcomingEventsService, } from './events.service.js';
export const createEvent = async (req, res, next) => {
    try {
        const event = await createEventService(req.body);
        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event,
        });
    }
    catch (err) {
        next(err);
    }
};
export const getUpcomingEvents = async (req, res, next) => {
    try {
        const { limit } = res.locals.validated;
        const events = await getUpcomingEventsService(limit);
        res.status(200).json({
            success: true,
            message: 'Upcoming events retrieved successfully',
            data: events,
        });
    }
    catch (err) {
        next(err);
    }
};
