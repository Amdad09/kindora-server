import { Router } from 'express';
import { getDB } from '../../config/db.js';

const router = Router();

router.get('/', async (_req, res) => {
    try {
        await getDB().command({ ping: 1 });

        return res.status(200).json({
            success: true,
            message: 'Kindora API is healthy',
            services: {
                api: 'connected',
                database: 'connected',
            },
            timestamp: new Date().toISOString(),
        });
    } catch {
        return res.status(503).json({
            success: false,
            message: 'Service unavailable',
            services: {
                api: 'connected',
                database: 'disconnected',
            },
            timestamp: new Date().toISOString(),
        });
    }
});

export default router;
