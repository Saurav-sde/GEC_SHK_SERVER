import {z} from 'zod';
export const GenderEnum = z.enum(["MALE", "FEMALE", "TRANSGENDER"]);
export const AdmissionTypeEnum = z.enum(["REGULAR", "LATERAL_ENTRY"]);

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const studentSchema = z.object({
  name: z.string().min(2),
  phoneNo: z.string(),
  parentName: z.string(),
  parentPhoneNo: z.string(),
  rollNo: z.string(),
  regNo: z.string(),
  gender: GenderEnum,
  hosteller: z.boolean(),
  admissionType: AdmissionTypeEnum,
  admissionDate: z.coerce.date(),
  deptId: z.number(),
  semId: z.number(),
  batchId: z.number(),
});

export const studentRegisterSchema = z.object({
  body: userSchema.merge(studentSchema),
});


export const userLoginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string()
    })
});


export const facultyRegisterSchema = z.object({
    body:z.object({
      email: z.string().email(),
      password: z.string(),
      name: z.string().min(2),
      phoneNo: z.string(),
      regNo: z.string(),
      deptId: z.number(),
      isHOD: z.boolean()
    })
});


export const adminRegisterSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
    name: z.string(),
    phoneNo: z.string()
  })
});