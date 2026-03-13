import express  from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeMiddleware } from "../middlewares/authorizeMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getStudent, getStudentById } from "../controllers/student.controller.js";



const studentRouter = express.Router();

studentRouter.get('/', authMiddleware, authorizeMiddleware("ADMIN"), asyncHandler(getStudent));

studentRouter.get('/:id', authMiddleware, asyncHandler(getStudentById));

export default studentRouter;