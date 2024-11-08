import { Request, Response } from "express"
import { UpdateMetaDataSchema } from "../../types"

import client from '@meta/db/client'
export const updateAvatar = async (req: Request, res: Response) => {
    try {
        const parseData = UpdateMetaDataSchema.safeParse(req.body)
        if (!parseData.success) {
            res.status(403).json({ message: "invalid inputs" })
            return
        }
        const userId = req.userId
        await client.user.update({
            data: {
                avatarId: parseData.data.avartarId
            },
            where: {
                id: userId
            }
        })
    } catch (err) {
        res.status(400).json({ message: "something went wrong" })
    }
}

export const getAllAvatar = async (req: Request, res: Response) => {
    try {
        const data = await client.avatar.findMany()
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json({ message: "somethings went wrong" })
    }
}

export const getBulkAvatarData = async (req: Request, res: Response) => {
    try {
        const ids = typeof req.query.ids === "string" ? req.query?.ids.split(',')?.map(id => id.trim()) : []
        const users = await client.user.findMany({
            where: {
                id: { in: ids }
            },
            select: {
                id: true,
                avatar: {
                    select: {
                        image: true
                    }
                }
            }
        })
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ message: "something went wrong" })
    }
}