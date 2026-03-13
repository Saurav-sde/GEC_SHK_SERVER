

import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authorizeMiddleware } from '../middlewares/authorizeMiddleware.js';
import { validateMiddleware } from '../middlewares/validateMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getUploadUrl } from '../controllers/upload.controller.js';
import { getUploadUrlSchema } from '../schemas/upload.schema.js';


const uploadRouter = express.Router();

uploadRouter.post('/admission', authMiddleware, authorizeMiddleware("ADMIN"), validateMiddleware(getUploadUrlSchema), asyncHandler(getUploadUrl));

uploadRouter.post('/getUrl', authMiddleware, )


export default uploadRouter;