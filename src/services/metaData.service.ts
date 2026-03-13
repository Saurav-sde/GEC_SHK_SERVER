import { prisma } from "../config/prisma.js"


export const getStudentFormData = async() => {
    const [
        departments,
        semesters, 
        batches
    ] = await Promise.all([
        prisma.department.findMany({
            select: {
                id: true,
                deptCode: true,
                name: true
            },
            orderBy: {
                name: "asc"
            }
        }),
        prisma.semester.findMany({
            select: {
                id: true,
                number: true,
                dept: {
                    select: {
                        deptCode: true,
                        id: true
                    }
                }
            },
            orderBy: {
                number: "asc"
            }
        }),
        prisma.batch.findMany({
            select: {
                id: true,
                name: true
            },
            orderBy: {
                name: "asc"
            }
        })
    ]);

    return {
        departments,
        semesters,
        batches
    }
};


