import {z} from 'zod';

const envSchema = z.object ({
    DATABASE_URL: z.string().url(),
    
    AWS_REGION: z.string(),
    AWS_ACCESS_KEY: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_BUCKET_NAME: z.string(),

    JWT_ACCESS_TOKEN_SECRET: z.string(),
    JWT_ACCESS_TOKEN_EXPIRY: z.string(),
    JWT_REFRESH_TOKEN_SECRET: z.string(),
    JWT_REFRESH_TOKEN_EXPIRY: z.string()
});

export const env = envSchema.parse(process.env);