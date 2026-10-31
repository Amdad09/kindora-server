import type { NextFunction, Request, Response } from 'express';
import {
    createEventService,
    getUpcomingEventsService,
} from './events.service.js';
import { eventQuerySchema } from './events.validation.js';
import type z from 'zod';

export const createEvent = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const event = await createEventService(req.body);
        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event,
        });
    } catch (err) {
        next(err);
    }
};

export const getUpcomingEvents = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { limit } = res.locals.validated as z.infer<
            typeof eventQuerySchema
        >;

        const events = await getUpcomingEventsService(limit);

        res.status(200).json({
            success: true,
            message: 'Upcoming events retrieved successfully',
            data: events,
        });
    } catch (err) {
        next(err);
    }
};