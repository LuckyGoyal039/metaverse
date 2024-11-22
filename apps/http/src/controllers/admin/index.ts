import { Request, Response } from "express";
import { CreateAvatarSchema, CreateElementSchema, CreateMapSchema, UpdateElementSchema } from "../../types";
import client from '@meta/db/client'

export const CreateNewElement = async (req: Request, res: Response) => {
    try {
        console.log("start element create...");
        const parseData = CreateElementSchema.safeParse(req.body)
        if (!parseData.success) {
            res.status(400).json({ message: "invalid inputs" })
            return
        }
        console.log("parseData: ", parseData);
        const element = await client.element.create({
            data: {
                image: parseData.data?.imageUrl,
                width: parseData.data?.width,
                height: parseData.data?.height,
                static: parseData.data?.static
            }
        })
        console.log("element created: ", element);
        if (!element) {
            res.status(400).json({ message: "unable to create element" })
            return
        }
        res.json({
            id: element.id
        })
    } catch (err) {
        res.status(500).json({
            message: "something went wrong"
        })
    }
}

export const updateElement = async (req: Request, res: Response) => {
    try {
        const parseData = UpdateElementSchema.safeParse(req.body)
        if (!parseData.success) {
            res.status(400).json({ message: "invalid inputs" })
        }
        const elementId = req.params.elementId
        const element = await client.element.findUnique({
            where: {
                id: elementId,
            }
        })
        if (!element) {
            res.status(400).json({ message: "element not found" })
            return
        }
        await client.element.update({
            where: {
                id: element.id
            },
            data: {
                image: parseData.data?.imageUrl
            }
        })
        res.json({ message: "element is updated successfully" })

    } catch (err) {
        res.status(400).json({ message: "something went wrong" })
    }
}

export const createAvatar = async (req: Request, res: Response) => {
    try {
        const parseData = CreateAvatarSchema.safeParse(req.body)
        if (!parseData.success) {
            res.status(400).json({ message: "invalid inputs" })
            return
        }
        const avatar = await client.avatar.create({
            data: {
                image: parseData.data?.imageUrl,
                name: parseData.data?.name
            }
        })
        res.json({
            avatarId: avatar.id
        })

    } catch (err) {
        res.status(400).json({ message: "something went wrong" })
    }
}

export const createMap = async (req: Request, res: Response) => {
    try {
     
        const parseData = CreateMapSchema.safeParse(req.body)
        if (!parseData.success) {
            res.status(400).json({ message: "invalid inputs" })
            return
        }
        const newMap = await client.map.create({
            data: {
                thumbnail: parseData.data?.thumbnail,
                name: parseData.data?.name,
                width: parseInt(parseData.data?.dimensions.split('x')[0]),
                height: parseInt(parseData.data?.dimensions.split('x')[1]),
                MapElement: {
                    create: parseData.data.defaultElements.map(ele => {
                        return {
                            elementId: ele.elementId,
                            x: ele.x,
                            y: ele.y
                        }
                    })
                }
            }
        })
        res.json({
            id: newMap.id
        })
    } catch (err) {
        console.log("create map error: ", err)
        res.status(400).json({ message: "something went wrong" })

    }
}