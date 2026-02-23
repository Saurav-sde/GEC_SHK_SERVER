import express from 'express';
import { validateMiddleware } from '../middlewares/validateMiddleware.js';
import { studentRegisterSchema, userLoginSchema } from '../schemas/auth.schems.js';
import {loginUser, registerStudent} from '../controllers/auth.controller.js'
import { asyncHandler } from '../utils/asyncHandler.js';
const authRouter = express.Router();


authRouter.post('/login',validateMiddleware(userLoginSchema) ,asyncHandler(loginUser));
authRouter.post('/register/student', validateMiddleware(studentRegisterSchema), asyncHandler(registerStudent));


export default authRouter;