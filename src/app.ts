import cookieParser from 'cookie-parser';
import express from 'express';
import type { Request, Response } from 'express';
import authRouter from './routes/auth.routes.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import uploadRouter from './routes/upload.routes.js';
import studentRouter from './routes/student.routes.js';
import facultyRouter from './routes/faculty.routes.js';
import cors from 'cors';
import adminRouter from './routes/admin.routes.js';
import metaDataRouter from './routes/metaData.routes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());


const corsOptions = {
    origin: [
        "https://gecshk.dev",
        "https://www.gecshk.dev"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};

app.use(cors(corsOptions));

// routes
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/student', studentRouter);
app.use('/api/faculty', facultyRouter);
app.use('/api/admin', adminRouter);
app.use('/api/meta', metaDataRouter);


app.use(globalErrorHandler);


app.get("/health", (req: Request,res: Response) => {
    res.json({
        status: "ok",
        service: "GEC_SHK_SERVER"
    });
});

export {app};

