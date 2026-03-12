import type { NextFunction, Request, Response } from "express"
import type { getFetchUrlInput, getUploadUrlInput } from "../types/upload.types.js"
import { generateGetPresignedUrl, generatePutPresignedUrl } from "../services/s3.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse, sendResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/prisma.js";


export const getUploadUrl = asyncHandler(
    async (req: Request, res: Response) => {
        const body = req.body as getUploadUrlInput;

        const presignedUrl = await generatePutPresignedUrl(body.fileName, body.contentType, body.folderName);

        if(!presignedUrl)
            throw new ApiError(500, 'unable to generate presigned url');

        if(!req.user?.id)
            throw new ApiError(401, "User not authenticated");

        // store meta data in the db
        const file = await prisma.file.create({
            data: {
                fileName: presignedUrl.url,
                originalName: body.fileName,
                s3Key: presignedUrl.key,
                mimeType: body.contentType,
                uploadedBy: req.user.id,
                size: Number(body.size)
            }
        });

        if(body.entity === "admission") {
            const job = await prisma.studentUploadJob.create({
                data: {
                    uploadedBy: req.user!.id,
                    fileId: file.id
                }
            });
        }

        return sendResponse(res, 201, { 
            url: presignedUrl.url, 
            key: presignedUrl.key, 
        }, 'url generated successfully');    
    }
)


export const getFetchUrl =  asyncHandler (
    async (req: Request, res: Response, next: NextFunction) => {
        const body = req.body as getFetchUrlInput;

        const presignedUrl = await generateGetPresignedUrl(body.key);

        if(!presignedUrl)
            throw new ApiError(500, 'unable to generate presigned url');

        return sendResponse(res, 201, {url: presignedUrl}, 'url generated successfully');
    }
)