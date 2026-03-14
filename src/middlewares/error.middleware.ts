import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { success } from "zod";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if(process.env.NODE_ENV !== "production") {
    console.error("🔥 Error:", err);
  }

  // Prisma unique error
  if(err.code === "P2002") {
    const rawFields =
      err.meta?.driverAdapterError?.cause?.constraint?.fields ??
      err.meta?.target;

    const fields = rawFields
      ?.map((f: string) => f.replace(/"/g, ""))
      .join(", ");

    return res.status(409).json({
      success: false,
      message: `${fields || "Field"} already exists`,
    });
  }

  // prisma record not found
  if(err.code === "P2025") {
    return res.json({
      success: false,
      message: "Record not found"
    })
  }

  // foreign key errors
  if(err.code === "P2003") {
    const field = err.meta?.field_name?.split("_")[1] || "foreign key";
    return res.status(400).json({
      success: false,
      message: `Invalid reference for ${field}`,
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