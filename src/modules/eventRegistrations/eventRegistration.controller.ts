import type { Request, Response, NextFunction } from 'express';
import { joinEventService } from './eventRegistration.service.js';

export const joinEvent = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userId } = res.locals.auth as {
            userId: string;
        };

        const result = await joinEventService(req.params.id as string, userId);

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
    } catch (error) {
        next(error);
    }
};
