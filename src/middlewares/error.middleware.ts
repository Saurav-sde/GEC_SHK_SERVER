import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("🔥 Error:", err);

  // Prisma known errors
  // UNIQUE constraint error
  if (err.code === "P2002") {
    const fields = (err.meta.driverAdapterError.cause.constraint.fields as string[])?.join(", ");

    return res.status(409).json({
      success: false,
      message: `Duplicate value for ${fields}`,
      errors: err.meta
    });
  }

  // Zod validation error
  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors,
    });
  }

  // Custom ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
    });
  }

  // Unknown errors
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};