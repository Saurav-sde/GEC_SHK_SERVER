import { prisma } from "../config/prisma.js"
import { ApiError } from "../utils/ApiError.js";

// dashboard
export const getDashboardStats = async() => {
    const [
        totalStudents,
        totalFaculties,
        totalAdmins,
        totalDepartments
    ] = await Promise.all([
        prisma.student.count(),
        prisma.faculty.count(),
        prisma.admin.count(),
        prisma.department.count()
    ]) ;

    return {
        totalStudents,
        totalFaculties,
        totalAdmins,
        totalDepartments
    }
}

// get all admins
export const getAllAdmin = async(query: any) => {
    const {page=1, limit=20} = query;
    const pageNumber = Number(page);
    const pageLimit = Number(limit);

    const admins = await prisma.admin.findMany({
        skip: (pageNumber - 1) * pageLimit,
        take: pageLimit,
        select: {
            id: true,
            name: true,
            phoneNo: true,
            user: {
                select : {
                    email: true
                }
            }
        }
    });

    return admins;
}

// get specific admin/:id
export const getAdminById = async(adminId: number) => {
    const admin = await prisma.admin.findUnique({
        where: {id: adminId},
        select: {
            id: true,
            name: true,
            phoneNo: true,
            user: {
                select: {
                    id: true,
                    email: true
                }
            }
        }
    })

    if(!admin) 
        return null;

    return admin
}

// delete specific admin/:id


// update details of specific admin admin/:id

