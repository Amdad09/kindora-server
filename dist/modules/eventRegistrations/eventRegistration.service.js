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
export const getJoinedEventsService = async (userId) => {
    const db = getDB();
    const joinedEvents = await db
        .collection('eventRegistrations')
        .aggregate([
        {
            $match: { userId },
        },
        {
            $lookup: {
                from: 'events',
                localField: 'eventId',
                foreignField: '_id',
                as: 'event',
            },
        },
        {
            $unwind: '$event',
        },
        {
            $project: {
                _id: '$event._id',
                title: '$event.title',
                description: '$event.description',
                eventType: '$event.eventType',
                imageUrl: '$event.imageUrl',
                location: '$event.location',
                eventDate: '$event.eventDate',
                createdBy: '$event.createdBy',
                createdAt: '$event.createdAt',
                updatedAt: '$event.updatedAt',
                joinedAt: 1,
            },
        },
        {
            $sort: { joinedAt: -1 },
        },
    ])
        .toArray();
    return joinedEvents;
};
export const getEventRegistrationCountService = async (eventId) => {
    if (!ObjectId.isValid(eventId)) {
        return { status: 'invalid-id' };
    }
    const eventObjectId = new ObjectId(eventId);
    const db = getDB();
    const event = await db
        .collection('events')
        .findOne({ _id: eventObjectId });
    if (!event) {
        return { status: 'event-not-found' };
    }
    const count = await db
        .collection('eventRegistrations')
        .countDocuments({ eventId: eventObjectId });
    return {
        status: 'success',
        count,
    };
};
export const leaveEventService = async (eventId, userId) => {
    const eventObjectId = new ObjectId(eventId);
    const result = await getDB()
        .collection('eventRegistrations')
        .deleteOne({
        eventId: eventObjectId,
        userId,
    });
    if (result.deletedCount === 0) {
        return { status: 'not-joined' };
    }
    return { status: 'left' };
};
