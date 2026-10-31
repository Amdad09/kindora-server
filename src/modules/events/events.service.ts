import { ObjectId } from 'mongodb';
import { getDB } from '../../config/db.js';
import type { Event } from './events.type.js';

const eventsCollection = () => getDB().collection('events');

export const createEventService = async (data: Event) => {
    const now = new Date();
    const event = {
        ...data,
        eventDate: new Date(data.eventDate),
        createdAt: now,
        updatedAt: now,
    };

    const result = await eventsCollection().insertOne(event);
    return { event, _id: result.insertedId };
};

export const getUpcomingEventsService = async (limit?: number) => {
    const now = new Date();
    const cursor = eventsCollection()
        .find({ eventDate: { $gt: now } })
        .sort({ eventDate: 1 });

    if (limit !== undefined) {
        cursor.limit(limit);
    }
    return cursor.toArray();
};

export const getEventByIdService = async (id: string) => {
    if (!ObjectId.isValid) {
        return null;
    }
    const event = await eventsCollection().findOne({
        _id: new ObjectId(id)
    });
    return event;
};
