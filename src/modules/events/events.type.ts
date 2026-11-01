import type { ObjectId } from 'mongodb';

export type CreateEventInput = {
    title: string;
    description: string;
    eventType: string;
    imageUrl: string;
    location: string;
    eventDate: string;
};

export type EventDocument = {
    _id?: ObjectId;
    title: string;
    description: string;
    eventType: string;
    imageUrl: string;
    location: string;
    eventDate: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
};
