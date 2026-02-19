
import {prisma} from "../src/config/prisma.js";
import { Role, Gender, AdmissionType } from "../generated/prisma/enums.js";

async function main() {
  // 1️⃣ USERS
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      password: "$2a$10$ray3.o/onmkDm9ZoI2.rfO/aDJ6kq71LgqqsR1P5UC9R50qpFuGZu",
      role: Role.ADMIN,
      updatedAt: new Date(),
    },
  });

  const facultyUser = await prisma.user.create({
    data: {
      email: "faculty@gmail.com",
      password: "$2a$10$ray3.o/onmkDm9ZoI2.rfO/aDJ6kq71LgqqsR1P5UC9R50qpFuGZu",
      role: Role.FACULTY,
      updatedAt: new Date(),
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      email: "student@gmail.com",
      password: "$2a$10$ray3.o/onmkDm9ZoI2.rfO/aDJ6kq71LgqqsR1P5UC9R50qpFuGZu",
      role: Role.STUDENT,
      updatedAt: new Date(),
    },
  });

  // 2️⃣ DEPARTMENT
  const department = await prisma.department.create({
    data: {
      name: "Computer Science",
      deptCode: "105",
      updatedAt: new Date(),
    },
  });

  // 3️⃣ SEMESTERS
  const semester1 = await prisma.semester.create({
    data: {
      number: 1,
      deptId: department.id,
      updatedAt: new Date(),
    },
  });

  // 4️⃣ BATCH
  const batch = await prisma.batch.create({
    data: {
      name: "2024-2028",
      updatedAt: new Date(),
    },
  });

  // 5️⃣ FACULTY
  const faculty = await prisma.faculty.create({
    data: {
      name: "Saurav Kumar",
      phoneNo: "9876543210",
      regNo: "FAC001",
      userId: facultyUser.id,
      deptId: department.id,
      updatedAt: new Date(),
    },
  });

  // 6️⃣ UPDATE HOD
  await prisma.department.update({
    where: { id: department.id },
    data: { hodId: faculty.id },
  });

  // 7️⃣ ADMIN
  await prisma.admin.create({
    data: {
      name: "Admin Saurav",
      phoneNo: "8888888888",
      userId: adminUser.id,
      updatedAt: new Date(),
    },
  });

  // 8️⃣ STUDENT
  await prisma.student.create({
    data: {
      name: "Aman Kumar",
      phoneNo: "7777777777",
      parentName: "Ramesh Kumar",
      parentPhoneNo: "6666666666",
      rollNo: "CSE001",
      regNo: "2024CSE001",
      gender: Gender.MALE,
      hosteller: false,
      admissionType: AdmissionType.REGULAR,
      admissionDate: new Date(),
      userId: studentUser.id,
      deptId: department.id,
      semId: semester1.id,
      batchId: batch.id,
      updatedAt: new Date(),
    },
  });

  console.log("Seeding done 🚀");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
