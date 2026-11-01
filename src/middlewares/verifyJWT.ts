import type { Request, Response, NextFunction } from 'express';
import { createRemoteJWKSet, jwtVerify, errors } from 'jose';
import { env } from '../config/env.js';

const JWKS = createRemoteJWKSet(new URL(`${env.betterAuthUrl}/api/auth/jwks`));

export const verifyJWT = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authentication token is required',
            });
        }

        const token = authHeader.slice(7).trim();

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication token is required',
            });
        }

        const { payload } = await jwtVerify(token, JWKS, {
            issuer: env.betterAuthUrl,
            audience: env.betterAuthUrl,
        });

        if (!payload.sub) {
            return res.status(401).json({
                success: false,
                message: 'Invalid authentication token',
            });
        }

        res.locals.auth = {
            userId: payload.sub,
            payload,
        };

        next();
    } catch (error) {
        if (error instanceof errors.JOSEError) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired authentication token',
            });
        }

        next(error);
    }
};
