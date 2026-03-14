
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import type { AdminRegisterInput, FacultyRegisterInput, StudentRegisterInput, userLoginInput } from "../types/auth.types.js";



export const loginUser = async (body: userLoginInput) => {
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
    if (!user.isActive)
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

    return { payload, accessToken };
}

export const registerStudent = async (body: StudentRegisterInput) => {
    let {
        email, rollNo, regNo, name, parentName, parentPhoneNo, phoneNo, gender, hosteller, admissionDate, admissionType, deptId, semId, batchId, cgpa, section
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

        // check department exists or not
        const department = await tx.department.findUnique({
            where: {id: deptId}
        })
        if(!department)
            throw new ApiError(400, "invalid department");

        // check batch exists or not
        const batch = await tx.batch.findUnique({
            where: { id: batchId },
        });
        if (!batch) 
            throw new ApiError(400, "invalid batch");

        // check semester exists or not and belongs to the same dept or not
        const semester = await tx.semester.findUnique({
            where: { id: semId },
        });
        if (!semester || semester.deptId !== deptId) 
            throw new ApiError(400, "invalid semester");

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
                regNo: regNo ?? null,
                gender,
                hosteller,
                admissionDate,
                admissionType,
                deptId,
                semId,
                batchId,
                userId: newUser.id,
                cgpa: cgpa ?? null,
                ...(section && { section })
            }
        });

        return {newUser, newStudent};
    });

    return result;
}


export const registerFaculty = async (body: FacultyRegisterInput) => {

    let { email, name, phoneNo, deptId, isHOD, password, designation, experience, specialization , bio} = body;

    // normalize the input
    email = email.trim().toLowerCase();
    name = name.trim();
    phoneNo = phoneNo.trim();

    const result = await prisma.$transaction(async (tx) => {

        // check if dept exists or not
        const dept = await tx.department.findUnique({
            where: {
                id: deptId
            }
        });

        if (!dept)
            throw new ApiError(400, "invalid department");

        // check if department already has hod or not
        if(isHOD && dept.hodId)
            throw new ApiError(400, "Department already has a HOD");

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
                designation,
                specialization,
                experience, 
                userId: newUser.id,
                deptId,
                bio: bio ?? null
            }
        })

        // update department if faculty is hod
        if (isHOD) {
            const updatedDept = await tx.department.update({
                where: {
                    id: deptId
                },
                data: {
                    hodId: newFaculty.id
                }
            })
        }

        return {newUser, newFaculty}
    });

    return result;
}


export const registerAdmin = async (body: AdminRegisterInput) => {
    let { email, password, name, phoneNo } = body;

    // normalize the input
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

}


export const checkMe = async (user: any) => {
    if (!user)
        throw new ApiError(401, "unauthorized");

    const { id, email, role } = user;

    let profile = null;

    if (role === "STUDENT") {
        profile = await prisma.student.findUnique({
            where: { userId: id },
            select: {
                id: true,
                name: true
            }
        })
    } else if (role === "FACULTY") {
        profile = await prisma.faculty.findUnique({
            where: { userId: id },
            select: {
                id: true,
                name: true
            }
        })
    } else {
        profile = await prisma.admin.findUnique({
            where: { userId: id },
            select: {
                id: true,
                name: true
            }
        })
    }

    return {
        userId: id,
        email,
        role,
        profile
    }
}