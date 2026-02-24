import cookieParser from 'cookie-parser';
import express from 'express';
import authRouter from './routes/auth.router.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import uploadRouter from './routes/upload.router.js';

const app = express();
// import cors from 'cors';

app.use(express.json());
app.use(cookieParser());


// routes
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter)





app.use(globalErrorHandler);
export {app};

