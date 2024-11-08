import z from 'zod'

export const SignUpSchema = z.object({
    username: z.string().email(),
    password: z.string().min(8),
    type: z.enum(["admin", "user"]),
})

export const SignInSchema = z.object({
    username: z.string().email(),
    password: z.string().min(8),
})

export const UpdateMetaDataSchema = z.object({
    avartarId: z.string()
})

export const CreateSpaceSchema = z.object({
    name: z.string(),
    dimensions: z.string(),
    mapId: z.string()
})
export const AddElementSchema = z.object({
    elementId: z.string(),
    spaceId: z.string(),
    x: z.number(),
    y: z.number(),
})
export const DeleteElementSchema = z.object({
    id: z.string(),
})
export const CreateElementSchema = z.object({
    imageUrl: z.string(),
    static: z.boolean(),
    width: z.number(),
    height: z.number(),
})
export const UpdateElementSchema = z.object({
    imageUrl: z.string(),
})
export const CreateAvatarSchema = z.object({
    imageUrl: z.string(),
    name: z.string(),
})
export const CreateMapSchema = z.object({
    thumbnail: z.string(),
    dimensions: z.string(),
    name:z.string(),
    defaultElements:z.array(
        z.object({
            elementId: z.string(),
            x:z.number(),
            y:z.number(),
        })
    )
})


