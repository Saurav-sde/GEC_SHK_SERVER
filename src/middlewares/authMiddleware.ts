import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import jwt from 'jsonwebtoken'
import { env } from "../config/env.js";
import type { JwtPayload } from "../types/jwt.js";
import { prisma } from "../config/prisma.js";



export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // extract token 
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if(!token)
            throw new ApiError(401, 'invalid token')

        // verify the token
        const payload = jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET) as JwtPayload;
        if(!payload)
            throw new ApiError(401, 'invalid token')

        const {id, role} = payload;
        if(!id || !role)
            throw new ApiError(401, 'invalid token')

        // find the user in the db
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        });

        if(!user)
            throw new ApiError(401, 'user not found');
        req.user = {id, role};
        next();

    } catch (err: any) {
        throw new ApiError(401, 'authentication failed');
    }
}