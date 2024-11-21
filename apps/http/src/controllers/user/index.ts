import { Request, Response } from "express"
import bcrypt from "bcryptjs";
import client from "@meta/db/client";
import { SignInSchema, SignUpSchema } from "../../types";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || ""
export const SignUp = async (req: Request, res: Response): Promise<void> => {
    const parseData = SignUpSchema.safeParse(req.body);
    if (!parseData.success) {
        res.status(400).json({
            message: "Invalid Inputs"
        })
        return
    }
    try {

        const { username, password, type } = parseData.data
        const existingUser = await client.user.findFirst({
            where: { password }
        });

        if (existingUser) {
            res.status(400).json({ message: "Username already taken" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await client.user.create({
            data: {
                username,
                password: hashedPassword,
                role: type === 'admin' ? "Admin" : "User",
            }
        });

        res.status(201).json({ userId: newUser.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const SignIn = async (req: Request, res: Response): Promise<void> => {
    const parseData = SignInSchema.safeParse(req.body);

    if (!parseData.success) {
        res.status(400).json({ message: "Invalid Inputs" });
        return;
    }

    try {
        const { username, password } = parseData.data;

        // Find the user by username
        const user = await client.user.findFirst({
            where: { username }
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const token = jwt.sign({ userId: user.id, username: user.username, role: user.role },
            JWT_SECRET
        )

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
