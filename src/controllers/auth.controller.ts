import { prisma } from "../config/prisma.js";
import type { AdminRegisterInput, FacultyRegisterInput, StudentRegisterInput, userLoginInput } from "../types/auth.types.js";
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
        const payload = { email: email, id: user.id, role: user.role };
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

        return sendResponse(res, 200, payload, "login successful")
    }
)


export const registerStudent = asyncHandler(
    async (req: Request, res: Response) => {
        // fetch the details from body
        const body = req.body as StudentRegisterInput;
        let {
            email, rollNo, regNo, name, parentName, parentPhoneNo, phoneNo, gender, hosteller, admissionDate, admissionType, deptId, semId, batchId
        } = body;

        // normalize the input
        email = email.trim().toLowerCase();
        rollNo = rollNo.trim().toUpperCase();
        regNo = regNo?.trim().toUpperCase();
        phoneNo = phoneNo.trim();
        parentPhoneNo = parentPhoneNo.trim();
        name = name.trim();
        parentName = parentName.trim();

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
                    OR: [
                        {phoneNo}, 
                        {rollNo}, 
                        ...(regNo ? [{regNo}]: [])
                    ]
                },
            });

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
            const password = `Shk${rollNo}`;
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
                    regNo: regNo ?? undefined,
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
        });

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
        const email = req.user?.email;
        const userId = req.user?.id;
        const role = req.user?.role;

        if(!email || !userId || !role) 
            throw new ApiError(401, "something went wrong")

        let profile = null;

        if(role === "STUDENT") {
            profile = await prisma.student.findUnique({
                where: {userId: userId},
                select: {
                    id: true,
                    name: true,
                    phoneNo: true,
                    regNo: true
                }
            })
        } else if(role === "FACULTY") {
            profile = await prisma.faculty.findUnique({
                where: {userId: userId},
                select: {
                    id: true,
                    name: true,
                    phoneNo: true,
                    regNo: true
                }
            })
        } else {
            profile = await prisma.admin.findUnique({
                where: {userId: userId},
                select: {
                    id: true,
                    name: true,
                    phoneNo: true
                }
            })
        }

        const reply = {
            userId,
            email,
            role,
            profile
        }

        sendResponse(res, 200, reply , "user authenticated successfully");

    }
)


export const registerFaculty = asyncHandler(
    async (req: Request, res: Response) => {
        const body = req.body as FacultyRegisterInput;

        let {email, name, phoneNo, regNo, deptId, isHOD, password } = body;

        // normalize the input
        email = email.trim().toLowerCase();
        name = name.trim();
        phoneNo = phoneNo.trim(),
        regNo = regNo.trim().toUpperCase();

        const result = await prisma.$transaction(async(tx) => {

            // check if dept exists or not
            const dept = await tx.department.findUnique({
                where: {
                    id: deptId
                }
            });

            if(!dept)
                throw new ApiError(400, "invalid department");

            // hash the pass
            const hashedPassword = await bcrypt.hash(password, 10);

            // create user
            const newUser = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role: "FACULTY"
                }
            })

            // create faculty
            const newFaculty = await tx.faculty.create({
                data: {
                    name,
                    phoneNo,
                    regNo,
                    userId: newUser.id,
                    deptId
                }
            })
            
            // update department if faculty is hod
            if(isHOD) {
                const updatedDept = await tx.department.update({
                    where: {
                        id: deptId
                    },
                    data: {
                        hodId: newFaculty.id
                    }
                })
            }
        });

        return sendResponse(res, 201, {}, "faculty registered successfully");
    }
)

export const registerAdmin = asyncHandler(
    async (req: Request, res: Response) => {
        const body = req.body as AdminRegisterInput;
        let {email, password, name, phoneNo} = body;

        // normalizxe the input
        email = email.trim().toLowerCase();
        name = name.trim();
        phoneNo = phoneNo.trim();

        const result = await prisma.$transaction(async (tx) => {
            // hash the pass
            const hashedPass = await bcrypt.hash(password, 10);
            // create user
            const newUser = await tx.user.create({
                data: {
                    email,
                    password: hashedPass,
                    role: "ADMIN"
                }
            });

            // create admin
            const newAdmin = await tx.admin.create({
                data: {
                    name,
                    phoneNo,
                    userId: newUser.id
                }
            })
        });

        return sendResponse(res, 201, {}, "admin registered successfully");
    }
)








