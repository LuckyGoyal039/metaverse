import { Router } from "express";
import { userMiddleware } from "../../middleware/user";
import { getBulkAvatarData, updateAvatar, SignoUT, getUserInfo, getAllMaps, checkLogin } from "../../controllers/avartar";

const userRouter = Router()

userRouter.post("/metadata", userMiddleware, updateAvatar)
userRouter.post("/metadata/bulk", userMiddleware, getBulkAvatarData)
userRouter.get('/sign-out', SignoUT)
userRouter.get("/user-info", userMiddleware, getUserInfo)
userRouter.get("/is-login", userMiddleware, checkLogin)
userRouter.get("/all-maps", getAllMaps)
export default userRouter