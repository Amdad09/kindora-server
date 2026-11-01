import { getDB } from '../../config/db.js';
export const ensureEventRegistrationIndexes = async () => {
    const registrations = getDB().collection('eventRegistrations');
    await registrations.createIndexes([
        {
            key: { eventId: 1, userId: 1 },
            unique: true,
            name: 'unique_event_user_registration',
        },
        {
            key: { userId: 1, joinedAt: -1 },
            name: 'user_registrations',
        },
        {
            key: { eventId: 1, joinedAt: -1 },
            name: 'event_participants',
        },
    ]);
    console.log('Event registration indexes created.');
};
