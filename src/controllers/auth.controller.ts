import { prisma } from "../config/prisma.js";
import type { StudentRegisterInput, userLoginInput } from "../types/auth.types.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse, sendResponse } from "../utils/ApiResponse.js";
import type { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const loginUser = asyncHandler(
    async (req: Request, res: Response) => {
        // validate the input 
        const body = req.body as userLoginInput;
        let { email, password } = body;

        // check email or password exists or not
        if (!email || !password) {
            throw new ApiError(400, "invalid credentials");
        }

        // extract user from db
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        // user not found with the given credential
        if (!user)
            throw new ApiError(401, 'invalid credentials');

        // user is not active
        if(!user.isActive)
            throw new ApiError(403, 'account is disabled');

        // check password is matched or not
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            throw new ApiError(401, 'invalid credentials');

        // send the access and refresh token
        const payload = { id: user.id, role: user.role };
        const accessToken = jwt.sign(
            payload,
            env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        if (!accessToken)
            throw new ApiError(401, 'something went wrong');

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

        return sendResponse(res, 200, { user: payload }, "login successful")
    }
)


export const registerStudent = asyncHandler(
    async (req: Request, res: Response) => {
        // fetch the details from body
        const body = req.body as StudentRegisterInput;
        let {
            email, password, rollNo, regNo, name, parentName, parentPhoneNo, phoneNo, gender, hosteller, admissionDate, admissionType, deptId, semId, batchId
        } = body;

        const result = await prisma.$transaction(async (tx) => {

            // check duplicate user
            const existingUser = await tx.user.findUnique({
                where: {
                    email
                }
            });

            if(existingUser)
                throw new ApiError(409, "email already exists");
            
            // check duplicate student based on phoneNo or rollNo or regNo
            const existingStudent = await tx.student.findFirst({
                where: {
                    OR: [{phoneNo}, {rollNo}, {regNo}]
                },
            })

            if (existingStudent)
                throw new ApiError(409, "student data already exists");

            // check semId exists in the db or not and it belongs to the same department or not
            const semester = await tx.semester.findUnique({
                where: { id: semId },
            });

            if (!semester || semester.deptId !== deptId) {
                throw new ApiError(400, "invalid semester");
            }

            // check batch exists in the db or not
            const batch = await tx.batch.findUnique({
                where: { id: batchId },
            });

            if (!batch) {
                throw new ApiError(400, "invalid batch");
            }

            // hash the pass
            const hashedPassword = await bcrypt.hash(password, 10);
            // create user
            const newUser = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role: "STUDENT"
                }
            })
            // create student
            const newStudent = await tx.student.create({
                data: {
                    name,
                    phoneNo,
                    parentName,
                    parentPhoneNo,
                    rollNo,
                    regNo,
                    gender,
                    hosteller,
                    admissionDate,
                    admissionType,
                    deptId,
                    semId,
                    batchId,
                    userId: newUser.id
                }
            });

            return { newUser, newStudent };
        });

        return sendResponse(
            res,
            201,
            {
                id: result.newStudent.id,
                email: result.newUser.email
            },
            "student registered successfully"
        );
    }
)










