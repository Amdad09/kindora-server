import { MongoClient, type Db } from 'mongodb';
import { env } from './env.js';

let client: MongoClient | null = null;
let db: Db | null = null;
let connectionPromise: Promise<Db> | null = null;

export const connectDB = async (): Promise<Db> => {
    if (db) return db;
    if (connectionPromise) return connectionPromise;

    const mongoClient = new MongoClient(env.mongoUrl);
    client = mongoClient;

    connectionPromise = (async () => {
        try {
            await mongoClient.connect();

            const database = mongoClient.db(env.dbName);

            await database.command({ ping: 1 });

            db = database;

            console.log('MongoDB connected successfully!');

            return database;
        } catch (error) {
            await mongoClient.close().catch(() => undefined);

            client = null;
            db = null;
            connectionPromise = null;

            throw error;
        }
    })();

    return connectionPromise;
};

export const getDB = (): Db => {
    if (!db) {
        throw new Error('Database not connected. Call connectDB() first.');
    }
    return db;
};

export const closeDB = async (): Promise<void> => {
    if (!client) return;

    await client.close();

    client = null;
    db = null;
    connectionPromise = null;

    console.log('MongoDB connection closed.');
};
