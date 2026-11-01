import { ObjectId, type Filter } from 'mongodb';
import { getDB } from '../../config/db.js';
import type { CreateEventInput, EventDocument } from './events.type.js';

const eventsCollection = () => getDB().collection<EventDocument>('events');

export const createEventService = async (data: CreateEventInput) => {
    const now = new Date();

    const event: EventDocument = {
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

export const getUpcomingEventsService = async (
    page: number,
    limit: number,
    eventType?: string,
) => {
    const now = new Date();

    // Step 1: Build MongoDB filter
    const filter: Filter<EventDocument> = {
        eventDate: { $gt: now },
    };

    // Step 2: Apply category filter
    if (eventType) {
        filter.eventType = eventType;
    }

    // Step 3: Calculate pagination offset
    const skip = (page - 1) * limit;

    // Step 4: Fetch events and total count together
    const [events, total] = await Promise.all([
        eventsCollection()
            .find(filter)
            .sort({ eventDate: 1 })
            .skip(skip)
            .limit(limit)
            .toArray(),

        eventsCollection().countDocuments(filter),
    ]);

    return {
        events,
        total,
    };
};

export const getEventByIdService = async (id: string) => {
    if (!ObjectId.isValid(id)) {
        return null;
    }

    return eventsCollection().findOne({
        _id: new ObjectId(id),
    });
};
