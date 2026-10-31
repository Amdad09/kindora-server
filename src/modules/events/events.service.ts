import { getDB } from "../../config/db.js";
import type { Event } from "./events.type.js";

const eventsCollection = () => getDB().collection('events');
const now = new Date();


export const createEventService = async(data: Event) => {
    const event = {
        ...data,
        eventDate: data.eventDate,
        createdAt: now,
        updatedAt: now
    }

    const result = await eventsCollection().insertOne(event);
    return { event, _id: result.insertedId };
};

export const getUpcomingEventsService = async (limit=6) => {
    const events = await eventsCollection()
        .find({ eventDate: { $gt: now } })
        .sort({ eventDate: 1 })
        .limit(limit)
        .toArray();
    
    return events;
}

// export const getUpcomingEvent = async (id: string) => {
//     const event = await eventsCollection().findOne({id});
// };