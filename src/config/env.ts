import 'dotenv/config'; 
import { z } from 'zod';

const envSchema = z.object({
    PORT: z.coerce.number().int().positive().default(5000),
    DB_NAME: z.string().min(3),
    MONGO_URI: z.string().min(3),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error('Invalid envirnment variable', parsedEnv.error.flatten().fieldErrors);
    process.exit(1);
}

export const env = {
    port: parsedEnv.data.PORT,
    dbName: parsedEnv.data.DB_NAME,
    mongoUrl: parsedEnv.data.MONGO_URI,
}