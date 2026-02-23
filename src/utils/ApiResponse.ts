import type { Response } from "express";
class ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: T, message: string = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };


export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  data: T,
  message = "Success"
) => {
  return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
};