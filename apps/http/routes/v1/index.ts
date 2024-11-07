import { Router } from "express";

const router = Router()

router.post('/signup',()=>{})
router.post('/signin', ()=>{})
router.use("/admin")
router.use("/space")

export default router