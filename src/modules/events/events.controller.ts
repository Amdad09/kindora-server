import type { Request, Response, NextFunction } from 'express';
import {
    createEventService,
    getEventByIdService,
    getUpcomingEventsService,
} from './events.service.js';

import { createEventsSchema, eventQuerySchema } from './events.validation.js';

import type { z } from 'zod';

export const createEvent = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = res.locals.validated as z.infer<typeof createEventsSchema>;

        const event = await createEventService(data);

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
        const { page, limit, eventType } = res.locals.validated as z.infer<
            typeof eventQuerySchema
        >;

        const { events, total } = await getUpcomingEventsService(
            page,
            limit,
            eventType,
        );

        res.status(200).json({
            success: true,
            message: 'Events retrieved successfully',
            data: events,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        next(err);
    }
};

export const getEventById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = res.locals.validated as { id: string };

        const event = await getEventByIdService(id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event retrieved successfully',
            data: event,
        });
    } catch (err) {
        next(err);
    }
};
