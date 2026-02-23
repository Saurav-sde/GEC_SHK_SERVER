
import {z} from 'zod'
import type { getUploadUrlSchema } from '../schemas/upload.schema.js'

export type getUploadUrlInput = z.infer<typeof getUploadUrlSchema>['body'];