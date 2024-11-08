import { Router } from "express";
import { userMiddleware } from "../../middleware/user";
import { getBulkAvatarData, updateAvatar } from "../../controllers/avartar";

const userRouter = Router()

userRouter.post("/metadata", userMiddleware, updateAvatar)
userRouter.post("/metadata/bulk", userMiddleware, getBulkAvatarData)
export default userRouter