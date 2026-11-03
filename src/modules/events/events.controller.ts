import type { NextFunction, Request, Response } from 'express';
import {
    createEventService,
    deleteEventService,
    getEventByIdService,
    getMyEventsService,
    getUpcomingEventsService,
    updateEventService,
} from './events.service.js';

import {
    createEventsSchema,
    eventQuerySchema,
    updateEventSchema,
} from './events.validation.js';

import type { z } from 'zod';

export const createEvent = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = res.locals.validated as z.infer<typeof createEventsSchema>;

        const { userId } = res.locals.auth as { userId: string };

        const event = await createEventService(data, userId);

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event,
        });
    } catch (err) {
        next(err);
    }
};

export const getMyEvents = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { page, limit, eventType } = res.locals.validated as z.infer<
            typeof eventQuerySchema
        >;

        const { userId } = res.locals.auth as { userId: string };

        const { events, total } = await getMyEventsService(
            userId,
            page,
            limit,
            eventType,
        );

        res.status(200).json({
            success: true,
            message: 'Your events retrieved successfully',
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

// export const getUpcomingEvents = async (
//     req: Request,
//     res: Response,
//     next: NextFunction,
// ) => {
//     try {
//         const auth = res.locals.auth as { userId: string } | undefined;
//         const { page, limit, eventType } = res.locals.validated as z.infer<
//             typeof eventQuerySchema
//         >;

//         const { events, total } = await getUpcomingEventsService(
//             page,
//             limit,
//             eventType,
//             auth?.userId,
//         );

//         res.status(200).json({
//             success: true,
//             message: 'Events retrieved successfully',
//             data: events,
//             pagination: {
//                 page,
//                 limit,
//                 total,
//                 totalPages: Math.ceil(total / limit),
//             },
//         });
//     } catch (err) {
//         next(err);
//     }
// };

export const getUpcomingEvents = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const auth = res.locals.auth as { userId: string } | undefined;

        const { page, limit, eventType, search } = res.locals
            .validated as z.infer<typeof eventQuerySchema>;

        const { events, total } = await getUpcomingEventsService(
            page,
            limit,
            eventType,
            auth?.userId,
            search,
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

export const updateEvent = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const id = String(req.params.id);

        const data = res.locals.validated as z.infer<typeof updateEventSchema>;

        const { userId } = res.locals.auth as {
            userId: string;
        };

        const event = await updateEventService(id, data, userId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: event,
        });
    } catch (err) {
        next(err);
    }
};

export const deleteEvent = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = res.locals.validated as {
            id: string;
        };

        const { userId } = res.locals.auth as {
            userId: string;
        };

        const isDeleted = await deleteEventService(id, userId);

        if (!isDeleted) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully',
        });
    } catch (err) {
        next(err);
    }
};
