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

export const SignoUT = async (req: Request, res: Response) => {
    try {
        const { token } = req.body
        console.log("jwt token: ", token)
        res.json({
            message: "sign out successfully"
        })
    } catch {
        console.log("Something went wrong")
        res.status(500).json({
            message: "Something went wrong"
        })

    }
}
export const getUserInfo = async (req: Request, res: Response) => {
    try {
        const userId = req.userId
        const user = await client.user.findUnique({
            where: {
                id: userId
            }
        })
        res.json(user)
    } catch (err) {
        console.log("Something went wrong: ", err)
        res.status(500).json({
            message: "Something went wrong"
        })

    }
}
export const getAllMaps = async (req: Request, res: Response) => {
    try {
        // const maps = await client.map.findMany({
        //     select: {
        //         id: true,
        //         name: true,
        //         thumbnail: true
        //     }
        // })
        const tempMaps = [
            {
                id: '1',
                thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcoKpBgO2hSf7FYCK2zS7OW-MSfxdKiwvj_A&s",
                name: "Garden"
            },
            {
                id: '2',
                thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcoKpBgO2hSf7FYCK2zS7OW-MSfxdKiwvj_A&s",
                name: "botanical"
            },
            {
                id: '3',
                thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcoKpBgO2hSf7FYCK2zS7OW-MSfxdKiwvj_A&s",
                name: "war"
            },
            {
                id: '4',
                thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcoKpBgO2hSf7FYCK2zS7OW-MSfxdKiwvj_A&s",
                name: "office"
            },
            {
                id: '5',
                thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcoKpBgO2hSf7FYCK2zS7OW-MSfxdKiwvj_A&s",
                name: "home"
            },
        ]
        res.json(tempMaps)
    } catch (err) {
        console.log("Something went wrong: ", err)
        res.status(500).json({
            message: "Something went wrong"
        })

    }
}