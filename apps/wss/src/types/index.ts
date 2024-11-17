import z from 'zod'

export const joinSpaceSchema = z.object({
    type: z.string(),
    payload: z.object({
        spaceId: z.string(),
        token: z.string()
    })
})

export const movementSchema = z.object({
    type: z.string(),
    payload: z.object({
        x: z.number(),
        y: z.number()
    })
})
