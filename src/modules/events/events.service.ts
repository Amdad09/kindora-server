import { ObjectId, type Filter } from 'mongodb';
import { getDB } from '../../config/db.js';
import type { CreateEventInput, EventDocument } from './events.type.js';

const eventsCollection = () => getDB().collection<EventDocument>('events');

export const createEventService = async (
    data: CreateEventInput,
    userId: string,
) => {
    const now = new Date();

    const event: EventDocument = {
        ...data,
        eventDate: new Date(data.eventDate),
        createdBy: userId,
        createdAt: now,
        updatedAt: now,
    };

    const result = await eventsCollection().insertOne(event);

    return {
        ...event,
        _id: result.insertedId,
    };
};

// export const getUpcomingEventsService = async (
//     page: number,
//     limit: number,
//     eventType?: string,
//     userId?: string,
// ) => {
//     const now = new Date();

//     const filter: Filter<EventDocument> = {
//         eventDate: { $gt: now },
//     };

//     if (eventType) {
//         filter.eventType = eventType;
//     }

//     const skip = (page - 1) * limit;

//     const pipeline = [
//         { $match: filter },
//         { $sort: { eventDate: 1 as const } },
//         { $skip: skip },
//         { $limit: limit },
//         {
//             $lookup: {
//                 from: 'eventRegistrations',
//                 let: { eventId: '$_id' },
//                 pipeline: [
//                     {
//                         $match: {
//                             $expr: {
//                                 $and: [
//                                     { $eq: ['$eventId', '$$eventId'] },
//                                     ...(userId
//                                         ? [{ $eq: ['$userId', userId] }]
//                                         : []),
//                                 ],
//                             },
//                         },
//                     },
//                 ],
//                 as: 'registrations',
//             },
//         },
//         {
//             $addFields: {
//                 isJoined: { $gt: [{ $size: '$registrations' }, 0] },
//             },
//         },
//         {
//             $project: {
//                 registrations: 0,
//             },
//         },
//     ];

//     const [events, total] = await Promise.all([
//         eventsCollection().aggregate(pipeline).toArray(),
//         eventsCollection().countDocuments(filter),
//     ]);

//     return { events, total };
// };

export const getUpcomingEventsService = async (
    page: number,
    limit: number,
    eventType?: string,
    userId?: string,
    search?: string,
) => {
    const now = new Date();

    const filter: Filter<EventDocument> = {
        eventDate: { $gt: now },
    };

    if (eventType) {
        filter.eventType = eventType;
    }

    if (search) {
        const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        filter.$or = [
            { title: { $regex: safeSearch, $options: 'i' } },
            { description: { $regex: safeSearch, $options: 'i' } },
            { location: { $regex: safeSearch, $options: 'i' } },
        ];
    }

    const skip = (page - 1) * limit;

    const pipeline = [
        { $match: filter },
        { $sort: { eventDate: 1 as const } },
        { $skip: skip },
        { $limit: limit },
        {
            $lookup: {
                from: 'eventRegistrations',
                let: { eventId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$eventId', '$$eventId'] },
                                    ...(userId
                                        ? [{ $eq: ['$userId', userId] }]
                                        : []),
                                ],
                            },
                        },
                    },
                ],
                as: 'registrations',
            },
        },
        {
            $addFields: {
                isJoined: { $gt: [{ $size: '$registrations' }, 0] },
            },
        },
        {
            $project: {
                registrations: 0,
            },
        },
    ];

    const [events, total] = await Promise.all([
        eventsCollection().aggregate(pipeline).toArray(),
        eventsCollection().countDocuments(filter),
    ]);

    return { events, total };
};

export const getEventByIdService = async (id: string) => {
    if (!ObjectId.isValid(id)) {
        return null;
    }

    return eventsCollection().findOne({
        _id: new ObjectId(id),
    });
};

// Get events created by the authenticated user
export const getMyEventsService = async (
    userId: string,
    page: number,
    limit: number,
    eventType?: string,
) => {
    const filter: Filter<EventDocument> = {
        createdBy: userId,
    };

    if (eventType) {
        filter.eventType = eventType;
    }

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
        eventsCollection()
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray(),

        eventsCollection().countDocuments(filter),
    ]);

    return { events, total };
};

export const updateEventService = async (
    id: string,
    data: CreateEventInput,
    userId: string,
) => {
    if (!ObjectId.isValid(id)) {
        return null;
    }

    const result = await eventsCollection().updateOne(
        {
            _id: new ObjectId(id),
            createdBy: userId,
        },
        {
            $set: {
                ...data,
                eventDate: new Date(data.eventDate),
                updatedAt: new Date(),
            },
        },
    );

    if (result.matchedCount === 0) {
        return null;
    }

    return eventsCollection().findOne({
        _id: new ObjectId(id),
        createdBy: userId,
    });
};

export const deleteEventService = async (
    id: string,
    userId: string,
): Promise<boolean> => {
    if (!ObjectId.isValid(id)) {
        return false;
    }

    const result = await eventsCollection().deleteOne({
        _id: new ObjectId(id),
        createdBy: userId,
    });

    return result.deletedCount === 1;
};