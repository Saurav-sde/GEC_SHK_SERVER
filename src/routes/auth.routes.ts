import express from 'express';
import { validateMiddleware } from '../middlewares/validateMiddleware.js';
import { adminRegisterSchema, facultyRegisterSchema, studentRegisterSchema, userLoginSchema } from '../schemas/auth.schema.js';
import {checkMe, loginUser, registerAdmin, registerFaculty, registerStudent} from '../controllers/auth.controller.js'
import { asyncHandler } from '../utils/asyncHandler.js';
import { authorizeMiddleware } from '../middlewares/authorizeMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const authRouter = express.Router();


authRouter.post('/login',validateMiddleware(userLoginSchema) ,asyncHandler(loginUser));
authRouter.post('/register/student',validateMiddleware(studentRegisterSchema), authMiddleware,authorizeMiddleware("ADMIN"), asyncHandler(registerStudent));

authRouter.post('/register/faculty', validateMiddleware(facultyRegisterSchema), authMiddleware, authorizeMiddleware("ADMIN"), asyncHandler(registerFaculty));

authRouter.post('/register/admin', validateMiddleware(adminRegisterSchema), authMiddleware, authorizeMiddleware("ADMIN"), asyncHandler(registerAdmin));

authRouter.get('/me', authMiddleware, checkMe);


export default authRouter;