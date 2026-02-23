import cookieParser from 'cookie-parser';
import express from 'express';
import authRouter from './routes/auth.router.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';

const app = express();
// import cors from 'cors';

app.use(express.json());
app.use(cookieParser());


// routes
app.use('/api/auth', authRouter);





app.use(globalErrorHandler);
export {app};

