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
export const getUpcomingEventsService = async (page, limit, eventType) => {
    const now = new Date();
    // Step 1: Build MongoDB filter
    const filter = {
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
export const getEventByIdService = async (id) => {
    if (!ObjectId.isValid(id)) {
        return null;
    }
    return eventsCollection().findOne({
        _id: new ObjectId(id),
    });
};
