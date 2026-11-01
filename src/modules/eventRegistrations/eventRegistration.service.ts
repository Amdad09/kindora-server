import { MongoServerError, ObjectId } from 'mongodb';
import { getDB } from '../../config/db.js';
import type { EventDocument } from '../events/events.type.js';
import type { EventRegistrationDocument } from './eventRegistrations.types.js';

export const joinEventService = async (eventId: string, userId: string) => {
    const db = getDB();

    const eventObjectId = new ObjectId(eventId);

    // First, check whether the event exists.
    const event = await db
        .collection<EventDocument>('events')
        .findOne({ _id: eventObjectId });

    if (!event) {
        return { status: 'event-not-found' as const };
    }

    const registration: EventRegistrationDocument = {
        eventId: eventObjectId,
        userId,
        joinedAt: new Date(),
    };

    try {
        const result = await db
            .collection<EventRegistrationDocument>('eventRegistrations')
            .insertOne(registration);

        return {
            status: 'joined' as const,
            registration: {
                _id: result.insertedId,
                ...registration,
            },
        };
    } catch (error) {
        // MongoDB duplicate key error
        if (error instanceof MongoServerError && error.code === 11000) {
            return { status: 'already-joined' as const };
        }

        throw error;
    }
};

export const getJoinedEventsService = async (userId: string) => {
    const db = getDB();

    const joinedEvents = await db
        .collection<EventRegistrationDocument>('eventRegistrations')
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

export const getEventRegistrationCountService = async (eventId: string) => {
    if (!ObjectId.isValid(eventId)) {
        return { status: 'invalid-id' as const };
    }

    const eventObjectId = new ObjectId(eventId);
    const db = getDB();

    const event = await db
        .collection<EventDocument>('events')
        .findOne({ _id: eventObjectId });

    if (!event) {
        return { status: 'event-not-found' as const };
    }

    const count = await db
        .collection<EventRegistrationDocument>('eventRegistrations')
        .countDocuments({ eventId: eventObjectId });

    return {
        status: 'success' as const,
        count,
    };
};

export const leaveEventService = async (eventId: string, userId: string) => {
    const eventObjectId = new ObjectId(eventId);

    const result = await getDB()
        .collection<EventRegistrationDocument>('eventRegistrations')
        .deleteOne({
            eventId: eventObjectId,
            userId,
        });

    if (result.deletedCount === 0) {
        return { status: 'not-joined' as const };
    }

    return { status: 'left' as const };
};