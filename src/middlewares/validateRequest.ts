import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';

type ValidationSource = 'body' | 'query' | 'params';

export const validateRequest = (
    schema: ZodType,
    source: ValidationSource = 'body',
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: result.error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                })),
            });
        }

        res.locals.validated = result.data;

        return next();
    };
};
