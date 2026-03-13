import { prisma } from "../config/prisma.js";



export const getFaculty = async(query:any) => {
    const {
        deptId,
        search,
        page=1,
        limit=20,
        sort="name",
        order="asc",
        isActive=true
    } = query;

    const pageNumber = Number(page);
    const pageLimit = Number(limit);

    const where: any = {};

    if(deptId)
        where.deptId = Number(deptId);

    if(isActive !== undefined) {
        where.isActive = isActive === "true" || isActive === true;
    }

    if(search) {
        where.OR = [
            {name: {contains: search, mode: "insensitive"}}
        ]
    }

    const allowedSortFields = ["name"];
    const sortField = allowedSortFields.includes(sort) ? sort : "name";

    const faculties = await prisma.faculty.findMany({
        where,
        skip: (pageNumber - 1) * pageLimit,
        take: pageLimit,
        orderBy: {
            [sortField]: order === "desc" ? "desc" : "asc"
        },
        select: {
            id: true,
            name: true,
            phoneNo: true,
            user: {
                select: {
                    email: true
                }
            },
            dept: {
                select: {
                    name: true,
                    deptCode: true
                }
            }
        }
    });

    const totalFaculties = await prisma.faculty.count({where});

    return {
        faculties,
        pagination: {
            total: totalFaculties,
            active: totalFaculties,
            leave: totalFaculties - totalFaculties,
            page: pageNumber,
            limit: pageLimit,
            totalPages: Math.ceil(totalFaculties / pageLimit)
        }
    }
}


export const getFacultyById = async(facultyId: number) => {

    const faculty = await prisma.faculty.findUnique({
        where: {id: facultyId},
        select: {
            id: true,
            name: true,
            phoneNo: true,
            dept: {
                select: {
                    name: true,
                    deptCode: true
                }
            },
            user: {
                select: {
                    email: true,
                    id: true
                }
            }
        }
    });

    if(!faculty)
        return null;
    return faculty;
}