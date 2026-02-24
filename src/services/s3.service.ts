import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import {env} from "../config/env.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../config/aws.js";


export const generatePutPresignedUrl = async (filename:string, contentType: string, folderName: string) => {
    const key = `uploads/${folderName}/${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: key,
        ContentType: contentType
    });

    const url = await getSignedUrl(s3, command, {
        expiresIn: 60 * 10
    });

    return {url, key};
}

export const generateGetPresignedUrl = async (key:string) => {
    const command = new GetObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: key
    });

    const url = await getSignedUrl(s3, command);
    return url;
}