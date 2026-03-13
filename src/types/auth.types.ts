import {z} from 'zod';
import type { adminRegisterSchema, facultyRegisterSchema, studentRegisterSchema, userLoginSchema } from '../schemas/auth.schema.js';



export type userLoginInput = z.infer<typeof userLoginSchema>['body'];
export type StudentRegisterInput = z.infer<typeof studentRegisterSchema>['body'];

export type FacultyRegisterInput = z.infer<typeof facultyRegisterSchema>['body']

export type AdminRegisterInput = z.infer<typeof adminRegisterSchema>['body']


