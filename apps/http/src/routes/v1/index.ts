import { Router } from "express";
import userRouter from "./user";

const router = Router()

router.post('/signup',()=>{})
router.post('/signin', ()=>{})
router.get('/elements', ()=>{})
router.get('/avatars', ()=>{})
router.use("/user", userRouter)
// router.use("/space", spaceRoute)
// router.use("/admin", adminRoute)

export default router