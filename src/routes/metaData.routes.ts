
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authorizeMiddleware } from '../middlewares/authorizeMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getStudentRegistrationMeta } from '../controllers/metaData.controller.js';



const metaDataRouter = express.Router();

metaDataRouter.get('/register-student', authMiddleware, authorizeMiddleware("ADMIN"), asyncHandler(getStudentRegistrationMeta));