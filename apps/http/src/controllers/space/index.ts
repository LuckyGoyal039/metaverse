import { Request, response, Response } from "express"
import { AddElementSchema, CreateSpaceSchema, DeleteElementSchema } from "../../types"
import client from '@meta/db/client'


export const createSpace = async (req: Request, res: Response) => {
    try {
        console.log('create space...')
        console.log(req.body);

        const parseData = CreateSpaceSchema.safeParse(req.body)
        if (!parseData.success) {
            res.status(403).json({
                message: "invalid inputs"
            })
            return
        }
        if (!parseData.data?.mapId) {
            const { name: spaceName, dimensions, } = req.body
            const spaceWidth = parseInt(dimensions.split('x')[0])
            const spaceHeight = parseInt(dimensions.split('x')[1])
            const space = await client.space.create({
                data: {
                    name: spaceName,
                    width: spaceWidth,
                    height: spaceHeight,
                    creatorId: req.userId!
                }
            })
            res.status(200).json({
                spaceId: space.id
            })
            return
        }
        const map = await client.map.findUnique({
            where: {
                id: parseData.data.mapId
            },
            select: {
                MapElement: true,
                width: true,
                height: true
            }
        })
        if (!map) {
            res.status(400).json({
                message: "invalid map"
            })
            return
        }
        const { name: spaceName, dimensions, } = req.body
        const space = await client.$transaction(async (client) => {

            const space = await client.space.create({
                data: {
                    name: spaceName,
                    width: map?.width,
                    height: map?.height,
                    creatorId: req.userId!,
                }
            })
            const mapElements = map?.MapElement?.map((e) => {
                return {
                    spaceId: space.id,
                    elementId: e.elementId,
                    x: e.x,
                    y: e.y,
                }

            })
            if (mapElements && mapElements?.length > 0) {
                await client.spaceElement.createMany({
                    data: mapElements
                })
            }
            return space
        })
        res.json({ spaceId: space.id })
    } catch (err) {
        res.status(400).json({ message: "something went wrong" })
    }
}

export const deleteSpace = async (req: Request, res: Response) => {
    try {
        const spaceId = DeleteElementSchema.safeParse(req.params.spaceId)
        if (!spaceId.success) {
            res.status(400).json({ message: "invalid inputs" })
            return
        }
        const space = await client.space.findUnique({
            where: {
                id: req.params.spaceId
            },
            select: {
                creatorId: true
            }
        })
        if (!space) {
            res.status(400).json({ message: "Unauthorized" })
            return
        }
        if (space?.creatorId != req.userId) {
            res.status(403).json({ message: "Unauthorized" })
            return
        }
        await client.space.delete({
            where: {
                id: req.params.spaceId
            },
        })
        res.json({
            message: "space deleted"
        })

    } catch (err) {
        res.status(500).json({
            message: "something went wrong"
        })

    }
}

export const getMySpace = async (req: Request, res: Response) => {
    try {
        const space = await client.space.findMany({
            where: {
                creatorId: req.userId
            },
            select: {
                id: true,
                name: true,
                width: true,
                height: true,
                thumbnail: true
            }
        })
        const result = space.map(ele => {
            let { width, height, ...rest } = ele
            let dimensions = `${width}x${height}`
            return {
                ...rest,
                dimensions: dimensions
            }
        })
        res.json(result)

    } catch (err) {
        res.status(400).json({ message: "Unauthorized" })
    }
}

export const createElement = async (req: Request, res: Response) => {
    try {
        const parseData = AddElementSchema.safeParse(req.body)
        if (!parseData.success) {
            res.status(400).json({ message: "invalid inputs" })
            return
        }
        const space = await client.space.findUnique({
            where: {
                creatorId: req.userId,
                id: parseData.data.spaceId
            }
        })
        if (!space) {
            res.status(400).json({ message: "space not found" })
            return
        }
        await client.spaceElement.create({
            data: {
                x: parseData.data.x,
                y: parseData.data.y,
                spaceId: parseData.data.spaceId,
                elementId: parseData.data.elementId
            }
        })
        res.json({
            message: "element created"
        })
    } catch (err) {
        res.status(400).json({
            message: "something went wrong"
        })
    }
}
export const deleteElement = async (req: Request, res: Response) => {
    try {
        const elementId = DeleteElementSchema.safeParse(req.body)
        if (!elementId.success) {
            res.status(400).json({ message: "invalid inputs" })
        }
        const spaceElement = await client.spaceElement.findFirst({
            where: {
                id: elementId.data?.id
            }
        })
        if (!spaceElement) {
            res.status(400).json({ message: "element not found" })
            return
        }
        await client.spaceElement.delete({
            where: {
                id: elementId.data?.id
            }
        })
        res.json({
            message: "element deleted"
        })
    } catch (err) {
        res.status(400).json({
            message: "something went wrong"
        })
    }
}

export const getSpace = async (req: Request, res: Response) => {
    try {
        const spaceId = req.params.spaceId
        const space = await client.space.findUnique({
            where: {
                id: spaceId
            },
            include: {
                SpaceElement: {
                    include: {
                        element: true
                    }
                }
            }
        })
        if (!space) {
            res.status(400).json({
                message: "space not found"
            })
        }

        res.json({
            "dimensions": `${space?.width}x${space?.height}`,
            "elements": space?.SpaceElement.map(ele => {
                return {
                    id: ele.id,
                    element: {
                        id: ele.element.id,
                        imageUrl: ele.element.image,
                        height: ele.element.height,
                        width: ele.element.width,
                        static: ele.element.static
                    },
                    x: ele.x,
                    y: ele.y
                }
            })
        })
    } catch (err) {
        res.status(400).json({
            message: "space not found"
        })
    }
}