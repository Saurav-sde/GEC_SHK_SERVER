
import {z} from 'zod'
import type { getFetchUrlSchema, getUploadUrlSchema } from '../schemas/upload.schema.js'

export type getUploadUrlInput = z.infer<typeof getUploadUrlSchema>['body'];
export type getFetchUrlInput = z.infer<typeof getFetchUrlSchema>['body'];