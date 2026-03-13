
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authorizeMiddleware } from '../middlewares/authorizeMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getFaculty, getFacultyById } from '../controllers/faculty.controller.js';



const facultyRouter = express.Router();


facultyRouter.get('/', authMiddleware, authorizeMiddleware("ADMIN"), asyncHandler(getFaculty));

facultyRouter.get('/:id', authMiddleware,authorizeMiddleware("ADMIN", "FACULTY"), asyncHandler(getFacultyById));


export default facultyRouter;