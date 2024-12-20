
import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"]
    const token = typeof header == "string" ? header?.split(" ")[1] : undefined
    if (!token) {
        res.status(403).json({
            message: "Unautorized"
        })
        return
    }
    try {
        const SECRET_KEY = process.env.JWT_SECRET || ""
        const decode = jwt.verify(token, SECRET_KEY) as { userId: string, username: string, role: string }
        req.userId = decode.userId
        next()
    } catch (err) {
        res.status(401).json({ message: "Unauthorized" })
        return
    }

}