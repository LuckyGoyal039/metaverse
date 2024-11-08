import { Router } from "express";
import { createAvatar, createMap, CreateNewElement, updateElement } from "../../controllers/admin";
import { adminMiddleware } from "../../middleware/admin";

const adminRouter = Router()

adminRouter.post("/element", adminMiddleware, CreateNewElement)
adminRouter.put("/element/:elementId", adminMiddleware, updateElement)
adminRouter.post("/avatar", adminMiddleware, createAvatar)
adminRouter.post("/map", adminMiddleware, createMap)
export default adminRouter