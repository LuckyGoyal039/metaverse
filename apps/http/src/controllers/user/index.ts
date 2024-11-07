import { Request, Response } from "express"

export const SignUp = (req: Request, res: Response) => {
    const { username, password, type } = req.body
    //first check in the database that username is exist or not
    
}