export interface CreateEventInput {
    title: string;
    description: string;
    eventType: string;
    imageUrl: string;
    location: string;
    eventDate: string;
}

export interface EventDocument extends Omit<CreateEventInput, 'eventDate'> {
    eventDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
