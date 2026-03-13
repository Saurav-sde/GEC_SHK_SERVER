import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response } from "express";

import * as metaDataService from "../services/metaData.service.js";
import { sendResponse } from "../utils/ApiResponse.js";

export const getStudentFormData = asyncHandler(
    async (req:Request, res: Response) => {
        const result = await metaDataService.getStudentFormData();

        sendResponse(res, 200, result, "data fetched successfully");
    }
)