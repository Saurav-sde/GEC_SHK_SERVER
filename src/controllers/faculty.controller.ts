import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response } from "express";

import * as facultyService from "../services/faculty.service.js";
import { sendResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";



export const getFaculty = asyncHandler(
    async(req: Request, res: Response) => {
        const result = await facultyService.getFaculty(req.query);

        return sendResponse(res, 200, result, "data fetched successfully");
    }
)


export const getFacultyById = asyncHandler(
    async(req: Request, res: Response) => {
        const {id} = req.params;
        
        if(!id)
            throw new ApiError(400, "id is missing");

        const result = await facultyService.getFacultyById(Number(id));

        if(!result)
            throw new ApiError(404, "faculty doesn't exists");

        if(req.user?.role === "FACULTY") {
            if(req.user?.id !== result.user.id)
                throw new ApiError(403, "no permission");
        }

        sendResponse(res, 200, result, "faculty fetched successfully");
    }
)