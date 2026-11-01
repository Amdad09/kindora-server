import { getDB } from '../../config/db.js';

export const ensureEventIndexes = async () => {
    const eventsCollection = getDB().collection('events');

    await eventsCollection.createIndexes([
        {
            key: { eventDate: 1 },
            name: 'event_date_asc',
        },
        {
            key: { eventType: 1, eventDate: 1 },
            name: 'event_type_date_asc',
        },
    ]);

    console.log('Event indexes created successfully.');
};
