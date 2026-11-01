import { MongoServerError, ObjectId } from 'mongodb';
import { getDB } from '../../config/db.js';
export const joinEventService = async (eventId, userId) => {
    const db = getDB();
    const eventObjectId = new ObjectId(eventId);
    // First, check whether the event exists.
    const event = await db
        .collection('events')
        .findOne({ _id: eventObjectId });
    if (!event) {
        return { status: 'event-not-found' };
    }
    const registration = {
        eventId: eventObjectId,
        userId,
        joinedAt: new Date(),
    };
    try {
        const result = await db
            .collection('eventRegistrations')
            .insertOne(registration);
        return {
            status: 'joined',
            registration: {
                _id: result.insertedId,
                ...registration,
            },
        };
    }
    catch (error) {
        // MongoDB duplicate key error
        if (error instanceof MongoServerError && error.code === 11000) {
            return { status: 'already-joined' };
        }
        throw error;
    }
};
