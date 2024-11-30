import { Router } from "express";
import { userMiddleware } from "../../middleware/user";
import { getBulkAvatarData, updateAvatar, SignoUT,getUserInfo, getAllMaps } from "../../controllers/avartar";

const userRouter = Router()

userRouter.post("/metadata", userMiddleware, updateAvatar)
userRouter.post("/metadata/bulk", userMiddleware, getBulkAvatarData)
userRouter.post('/sign-out', userMiddleware, SignoUT)
userRouter.get("/user-info", userMiddleware, getUserInfo)
userRouter.get("/all-maps", getAllMaps)
export default userRouter