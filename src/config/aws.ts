import { S3Client } from "@aws-sdk/client-s3";
import {env} from "./env.js"
import { SQSClient } from "@aws-sdk/client-sqs";


export const s3 = new S3Client({
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY
    }
})

export const sqs = new SQSClient({
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY
    }
});



