import cookieParser from 'cookie-parser';
import express from 'express';
import type { Request, Response } from 'express';
import authRouter from './routes/auth.routes.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import uploadRouter from './routes/upload.routes.js';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from './config/swagger.js';

const app = express();
// import cors from 'cors';

app.use(express.json());
app.use(cookieParser());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// routes
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter)





app.use(globalErrorHandler);


app.get("/health", (req: Request,res: Response) => {
    res.json({
        status: "ok",
        service: "GEC_SHK_SERVER"
    });
});

export {app};

