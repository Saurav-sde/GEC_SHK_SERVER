import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response } from "express";
import * as studentService from "../services/student.service.js";
import { sendResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


export const getStudentsForAdmin = asyncHandler(
    async (req:Request, res: Response) => {
        const result = await studentService.getAllStudentForAdmin();
        return sendResponse(res, 200, result, "data fetched successfully");
    }
)

export const getStudent = asyncHandler(
    async (req:Request, res: Response) => {
        const result = await studentService.getStudent(req.query);
        return sendResponse(res, 200, result, "students fetched successfully");
    }
)

export const getStudentById = asyncHandler(
    async (req:Request, res: Response) => {
        const id = req.params.id;
        
        if(!id)
            throw new ApiError(400, "id is missing");

        const result = await studentService.getStudentById(Number(id));
        
        if(!result)
            throw new ApiError(404, "student doesn't exist");

        if(req.user?.role === "STUDENT") {
            if(req.user?.id != result.student.user.id)
                throw new ApiError(403, "no permission");
        }

        sendResponse(res, 200, result, "student fetched successfully");
    }
)