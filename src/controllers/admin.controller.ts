import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

import * as adminService from "../services/admin.service.js";
import { sendResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


export const getDashboardStats = asyncHandler(
    async(req: Response, res: Response) => {
        const result = await adminService.getDashboardStats();

        return sendResponse(res, 200, result, "dashboard fetched successfully");
    }
)

export const getAllAdmins = asyncHandler(
    async(req:Request, res: Response) => {
        const result = await adminService.getAllAdmin(req.query);
        return sendResponse(res, 200, result, "admins fetched successfully");
    }
)

export const getAdminById = asyncHandler(
    async(req: Request, res: Response) => {
        const {id} = req.params;
        if(!id)
            throw new ApiError(404, "id is missing");

        const result = await adminService.getAdminById(Number(id));

        if(!result)
            throw new ApiError(404, "admin not found");
        sendResponse(res, 200, result, "admin fetched successfully");
    }
)


