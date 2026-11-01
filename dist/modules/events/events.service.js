import { ObjectId } from 'mongodb';
import { getDB } from '../../config/db.js';
const eventsCollection = () => getDB().collection('events');
export const createEventService = async (data) => {
    const now = new Date();
    const event = {
        ...data,
        eventDate: new Date(data.eventDate),
        createdAt: now,
        updatedAt: now,
    };
    const result = await eventsCollection().insertOne(event);
    return {
        ...event,
        _id: result.insertedId,
    };
};
export const getUpcomingEventsService = async (limit) => {
    const now = new Date();
    const cursor = eventsCollection()
        .find({ eventDate: { $gt: now } })
        .sort({ eventDate: 1 });
    if (limit !== undefined) {
        cursor.limit(limit);
    }
    return cursor.toArray();
};
export const getEventByIdService = async (id) => {
    if (!ObjectId.isValid(id)) {
        return null;
    }
    return eventsCollection().findOne({
        _id: new ObjectId(id),
    });
};
