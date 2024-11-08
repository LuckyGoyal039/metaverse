import { Request, Response } from "express"
import bcrypt from "bcryptjs";
import client from "@meta/db/client";

export const SignUp = async (req: Request, res: Response) => {
    const { username, password, role, avatarId } = req.body;

    try {
        // Check if username already exists
        const existingUser = await client.user.findFirst({
            where: { username }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Username already taken" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await client.user.create({
            data: {
                username,
                password: hashedPassword,
                role,
                avatarId
            }
        });

        return res.status(201).json({ message: "User created successfully", userId: newUser.id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const SignIn = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await client.user.findFirst({
            where: { username }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        return res.status(200).json({ message: "Login successful", userId: user.id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
