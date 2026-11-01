import cors from 'cors';
import express from 'express';

import eventsRoute from './modules/events/events.routes.js';
import healthRoute from './modules/health/health.routes.js';
import eventRegistrationRoute from './modules/eventRegistrations/eventRegistration.routes.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

import { env } from './config/env.js';

const app = express();

app.use(
    cors({
        origin: env.clientUrl,
    }),
);

app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Kindora API is running',
    });
});

app.use('/health', healthRoute);
app.use('/events', eventsRoute);
app.use('/events', eventRegistrationRoute);
// Unknown routes
app.use(notFound);

// Centralized error handler — must be last
app.use(errorHandler);

export default app;
