
import {prisma} from "../src/config/prisma.js";
import { Role, Gender, AdmissionType } from "../generated/prisma/enums.js";


async function main() {

  console.log("Seeding started...");

  // Department
  const cseDept = await prisma.department.create({
    data: {
      name: "Computer Science and Engineering",
      deptCode: "105"
    }
  });

  const eceDept = await prisma.department.create({
    data: {
      name: "Electronics and Communication Engineering",
      deptCode: "103"
    }
  });

  // 2️⃣ Batch
  const batch2023 = await prisma.batch.create({
    data: { name: "2023-2027" }
  });

  const batch2024 = await prisma.batch.create({
    data: { name: "2024-2028" }
  });

  // 3️⃣ Semester
  await prisma.semester.createMany({
    data: [
      { number: 5, deptId: cseDept.id },
      { number: 5, deptId: eceDept.id },
    ]
  });

  //  Users 
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      password: "$2a$10$fnHOyyam3FEFx/fJIg6w2OqHfPIDmbquEfs/cGX4G5Hjm.9Zp2zLm",
      role: Role.ADMIN
    }
  })
  const facultyUser1 = await prisma.user.create({
    data: {
      email: "cse@gmail.com",
      password: "$2a$10$fnHOyyam3FEFx/fJIg6w2OqHfPIDmbquEfs/cGX4G5Hjm.9Zp2zLm",
      role: Role.FACULTY
    }
  });

  const facultyUser2 = await prisma.user.create({
    data: {
      email: "ece@gmail.com",
      password: "$2a$10$fnHOyyam3FEFx/fJIg6w2OqHfPIDmbquEfs/cGX4G5Hjm.9Zp2zLm",
      role: Role.FACULTY
    }
  });

  // Faculty
  await prisma.faculty.create({
    data: {
      name: "Saurav Kumar",
      phoneNo: "9876543210",
      regNo: "FAC001",
      userId: facultyUser1.id,
      deptId: cseDept.id
    }
  });

  await prisma.faculty.create({
    data: {
      name: "Aditya Kumar",
      phoneNo: "9876543211",
      regNo: "FAC002",
      userId: facultyUser2.id,
      deptId: eceDept.id
    }
  });

  // Admin
  await prisma.admin.create({
    data: {
      name: "Saurav",
      phoneNo: "6202404482",
      userId: adminUser.id
    }
  })

  console.log("Seeding completed");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });