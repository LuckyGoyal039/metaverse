import { Request, Response } from "express"
import client from '@meta/db/client'

export const getAllElement = async (req: Request, res: Response) => {
    try {
        const result = await client.element.findMany()
        console.log("all elements: ",result);
        res.status(200).json(result);

    } catch (err) {
        res.status(400).json({ message: "something went wrong" })
    }
}