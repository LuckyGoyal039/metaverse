import { Router } from "express";
import { userMiddleware } from "../../middleware/user";
import { getBulkAvatarData, updateAvatar, SignoUT } from "../../controllers/avartar";

const userRouter = Router()

userRouter.post("/metadata", userMiddleware, updateAvatar)
userRouter.post("/metadata/bulk", userMiddleware, getBulkAvatarData)
userRouter.post('/sign-out', userMiddleware, SignoUT)
export default userRouter