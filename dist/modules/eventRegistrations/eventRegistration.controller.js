import { getJoinedEventsService, joinEventService } from './eventRegistration.service.js';
import { getEventRegistrationCountService } from './eventRegistration.service.js';
import { leaveEventService } from './eventRegistration.service.js';
export const joinEvent = async (req, res, next) => {
    try {
        const { userId } = res.locals.auth;
        const result = await joinEventService(req.params.id, userId);
        if (result.status === 'event-not-found') {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }
        if (result.status === 'already-joined') {
            return res.status(409).json({
                success: false,
                message: 'You have already joined this event',
            });
        }
        return res.status(201).json({
            success: true,
            message: 'Successfully joined the event',
            data: result.registration,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getJoinedEvents = async (req, res, next) => {
    try {
        const { userId } = res.locals.auth;
        const joinedEvents = await getJoinedEventsService(userId);
        return res.status(200).json({
            success: true,
            message: 'Joined events retrieved successfully',
            data: joinedEvents,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getEventRegistrationCount = async (req, res, next) => {
    try {
        const eventId = req.params.id;
        const result = await getEventRegistrationCountService(eventId);
        if (result.status === 'invalid-id') {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID',
            });
        }
        if (result.status === 'event-not-found') {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }
        return res.status(200).json({
            success: true,
            data: {
                eventId,
                participantsCount: result.count,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const leaveEvent = async (req, res, next) => {
    try {
        const { userId } = res.locals.auth;
        const eventId = req.params.id;
        const result = await leaveEventService(eventId, userId);
        if (result.status === 'not-joined') {
            return res.status(404).json({
                success: false,
                message: 'You have not joined this event',
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Successfully left the event',
        });
    }
    catch (error) {
        next(error);
    }
};
