import { Router } from "express";
import userRouter from "./user";
import { SignIn, SignUp } from "../../controllers/user";

const router = Router()

router.post('/signup', SignUp)
router.post('/signin', SignIn)
router.get('/elements', () => { })
router.get('/avatars', () => { })
router.use("/user", userRouter)
// router.use("/space", spaceRoute)
// router.use("/admin", adminRoute)

export default router