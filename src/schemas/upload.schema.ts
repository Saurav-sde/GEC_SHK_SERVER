import { z } from 'zod'

export const getUploadUrlSchema = z.object({
    body: z.object({
        fileName: z.string(),
        contentType: z.string(),
        folderName: z.string().min(3, 'foldername must be of atleast 3 characters').max(30, 'folder name must be of atmost 30 characters'),
        size: z.coerce.number(),
        entity: z.string().toUpperCase()
    })
})

export const getFetchUrlSchema = z.object({
    body: z.object({
        key: z.string()
    })
});
