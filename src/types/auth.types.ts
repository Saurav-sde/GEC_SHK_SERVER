import {z} from 'zod';
import type { studentRegisterSchema, userLoginSchema } from '../schemas/auth.schems.js';



export type userLoginInput = z.infer<typeof userLoginSchema>['body'];
export type StudentRegisterInput = z.infer<typeof studentRegisterSchema>['body'];


