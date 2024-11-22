import { Router } from "express";
import userRouter from "./user";
import { SignIn, SignUp } from "../../controllers/user";
import spaceRouter from "./space";
import adminRouter from "./admin";
import { getAllAvatar } from "../../controllers/avartar";
import { getAllElement } from "../../controllers/element";

const router = Router()

router.post('/signup', SignUp)
router.post('/signin', SignIn)
router.get('/elements', getAllElement)
router.get('/avatars', getAllAvatar)
router.use("/user", userRouter)
router.use("/space", spaceRouter)
router.use("/admin", adminRouter)

export default router