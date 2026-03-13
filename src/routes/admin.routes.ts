import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeMiddleware } from "../middlewares/authorizeMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getAdminById, getAllAdmins, getDashboardStats } from "../controllers/admin.controller.js";

const adminRouter = express.Router();

adminRouter.get('/', authMiddleware, authorizeMiddleware("ADMIN"), asyncHandler(getAllAdmins));

adminRouter.get('/dashboard', authMiddleware, authorizeMiddleware("ADMIN"), asyncHandler(getDashboardStats));

adminRouter.get('/:id', authMiddleware, authorizeMiddleware("ADMIN"), asyncHandler(getAdminById));

export default adminRouter; 