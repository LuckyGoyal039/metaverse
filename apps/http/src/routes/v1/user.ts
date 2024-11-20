import { Router } from "express";
import { userMiddleware } from "../../middleware/user";
import { getBulkAvatarData, updateAvatar, SignoUT,getUserInfo } from "../../controllers/avartar";

const userRouter = Router()

userRouter.post("/metadata", userMiddleware, updateAvatar)
userRouter.post("/metadata/bulk", userMiddleware, getBulkAvatarData)
userRouter.post('/sign-out', userMiddleware, SignoUT)
userRouter.get("/user-info", userMiddleware, getUserInfo)
export default userRouter