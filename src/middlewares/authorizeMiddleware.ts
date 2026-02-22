

import type { Request, Response, NextFunction, RequestHandler } from "express";
import { ApiError } from "../utils/ApiError.js";

export const authorizeMiddleware = (...allowedRoles: string[]) : RequestHandler => 
(req: Request, res: Response, next: NextFunction) => {
    if(!req.user || !allowedRoles.includes(req.user.role))
        throw new ApiError(403, 'access denied')

    next();
}