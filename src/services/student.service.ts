import { prisma } from "../config/prisma.js";

// get All student detail
export const getStudent =  async (query:any) => {
    const {
        deptId,
        semId,
        batchId,
        search,
        page=1,
        limit=20,
        sort="name",
        order="asc",
        isActive = true
    } = query;

    const pageNumber = Number(page);
    const pageLimit = Number(limit);

    const where: any = {};

    if(deptId)
        where.deptId = Number(deptId);

    if(semId)
        where.semId = Number(semId);

    if(batchId)
        where.batchId = Number(batchId);

    if(isActive !== undefined) {
        where.isActive = isActive === "true" || isActive === true;
    }
       

    if(search) {
        where.OR = [
            {name: {contains: search, mode: "insensitive"}},
            {rollNo: {contains: search, mode: "insensitive"}},
            {regNo: {contains: search, mode: "insensitive"}}
        ];
    }

    const allowedSortFields = ["name", "rollNo", "regNo", "admissionDate", "admissionType"];
    const sortField = allowedSortFields.includes(sort) ? sort : "name";

    const students = await prisma.student.findMany({
        where: where,
        skip: (pageNumber - 1) * pageLimit,
        take: pageLimit,

        orderBy: {
            [sortField]: order === "desc" ? "desc" : "asc"
        },

        select: {
            id: true,
            name: true,
            rollNo: true,
            regNo: true,
            dept: {
                select: {id: true, name: true, deptCode: true}
            },
            batch: {
                select: {id: true, name: true}
            }
        },
    });

    const totalStudents = await prisma.student.count({where});

    return {
        students,
        pagination: {
            total: totalStudents,
            page: pageNumber,
            limit: pageLimit,
            totalPages: Math.ceil(totalStudents / pageLimit)
        }
    }
}

// get specific student detail
export const getStudentById = async (studentId: number) => {    
    const student = await prisma.student.findUnique({
        where: {id: studentId},
        select: {
            id: true,
            name: true,
            phoneNo: true,
            parentName: true,
            parentPhoneNo: true,
            rollNo: true,
            regNo: true,
            section: true,
            hosteller: true,
            admissionDate: true,
            admissionType: true,
            dept: {
                select: {
                    deptCode: true,
                    name: true,
                    id: true
                }
            },
            sem: {
                select: {
                    id: true,
                    number: true
                }
            },
            user: {
                select: {
                    email: true,
                    id: true,
                }
            },
            batch: {
                select: {
                    name: true
                }
            }
        }
    })

    if(!student)    
        return null;
    return student;
}

// delete specific student
