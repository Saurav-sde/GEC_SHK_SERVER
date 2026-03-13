import type { AdminRegisterInput, FacultyRegisterInput, StudentRegisterInput, userLoginInput } from "../types/auth.types.js";
import { sendResponse } from "../utils/ApiResponse.js";
import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as authService from "../services/auth.service.js";

export const loginUser = asyncHandler(
    async (req: Request, res: Response) => {
        const body = req.body as userLoginInput;
        
        const result = await authService.loginUser(body);

        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

        return sendResponse(res, 200, result.payload, "login successful")
    }
)


export const registerStudent = asyncHandler(
    async (req: Request, res: Response) => {
        // fetch the details from body
        const body = req.body as StudentRegisterInput;
        await authService.registerStudent(body);
        return sendResponse(
            res,
            201,
            {},
            "student registered successfully"
        );
    }
)

export const checkMe = asyncHandler(
    async(req: Request, res: Response) => {
        const result = await authService.checkMe(req.user);
        sendResponse(res, 200, result , "user authenticated successfully");
    }
)


export const registerFaculty = asyncHandler(
    async (req: Request, res: Response) => {
        const body = req.body as FacultyRegisterInput;

        await authService.registerFaculty(body);
        return sendResponse(res, 201, {}, "faculty registered successfully");
    }
)

export const registerAdmin = asyncHandler(
    async (req: Request, res: Response) => {
        const body = req.body as AdminRegisterInput;
        await authService.registerAdmin(body);
        return sendResponse(res, 201, {}, "admin registered successfully");
    }
)










