import { Router } from "express";
import { userMiddleware } from "../../middleware/user";

import client from '@meta/db/client'
import { updateAvatar } from "../../controllers/avartar";
import { createSpace } from "../../controllers/space";

const userRouter = Router()

userRouter.post("/metadata", userMiddleware, updateAvatar)
userRouter.post("/metadata/bulk", createSpace)
export default userRouter