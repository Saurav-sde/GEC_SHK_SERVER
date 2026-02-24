import {z} from 'zod'

export const getUploadUrlSchema = z.object({
    body: z.object({
        fileName: z.string().max(40, 'filename must be of atmost 40 characters'),
        contentType: z.string(),
        folderName: z.string().min(3, 'foldername must be of atleast 3 characters').max(30, 'folder name must be of atmost 30 characters')
    })
})

export const getFetchUrlSchema = z.object({
    body: z.object({
        key: z.string()
    })
});
