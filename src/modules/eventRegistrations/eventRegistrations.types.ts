import type { ObjectId } from 'mongodb';

export type EventRegistrationDocument = {
    _id?: ObjectId;
    eventId: ObjectId;
    userId: string;
    joinedAt: Date;
};
