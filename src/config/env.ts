import {z} from 'zod';
import jwt from "jsonwebtoken";

const envSchema = z.object ({
    DATABASE_URL: z.string().url(),
    
    AWS_REGION: z.string(),
    AWS_ACCESS_KEY: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_BUCKET_NAME: z.string(),

    JWT_ACCESS_TOKEN_SECRET: z.string(),
    JWT_ACCESS_TOKEN_EXPIRY: z.string(),
    JWT_REFRESH_TOKEN_SECRET: z.string(),
    JWT_REFRESH_TOKEN_EXPIRY: z.string(),

    PORT: z.string()
});

export const env = envSchema.parse(process.env);

// import jwt from "jsonwebtoken";

// export const env = {
//   JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET as string,
//   JWT_ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"],
// };