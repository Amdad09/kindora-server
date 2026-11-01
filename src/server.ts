import app from './app.js';
import { connectDB, closeDB } from './config/db.js';
import { env } from './config/env.js';
import { ensureEventRegistrationIndexes } from './modules/eventRegistrations/eventRegistration.indexes.js';
import { ensureEventIndexes } from './modules/events/events.indexes.js';

const start = async () => {
    try {
        await connectDB();
        await ensureEventIndexes();
        await ensureEventRegistrationIndexes();
        const server = app.listen(env.port, () => {
            console.log(`Kindora API running on port ${env.port}`);
        });

        let isShuttingDown = false;

        const shutdown = (signal: string) => {
            if (isShuttingDown) return;

            isShuttingDown = true;

            console.log(`${signal} received. Shutting down...`);

            server.close(async (error) => {
                try {
                    if (error) {
                        console.error('Server shutdown error:', error);
                    }

                    await closeDB();

                    console.log('Kindora server stopped gracefully.');

                    process.exit(error ? 1 : 0);
                } catch (err) {
                    console.error('Shutdown failed:', err);
                    process.exit(1);
                }
            });
        };

        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));
    } catch (err) {
        console.error('Failed to start server:', err);

        await closeDB().catch(console.error);

        process.exit(1);
    }
};

start();
