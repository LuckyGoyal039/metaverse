import { Router } from "express";
import { userMiddleware } from "../../middleware/user";
import { createElement, createSpace, deleteElement, deleteSpace, getMySpace, getSpace, tempCreateSpace } from "../../controllers/space";

const spaceRouter = Router()

spaceRouter.post("/", userMiddleware, tempCreateSpace)
spaceRouter.delete("/:spaceId", deleteSpace)
spaceRouter.get("/all", userMiddleware, getMySpace)
spaceRouter.get("/:spaceId", userMiddleware, getSpace)
spaceRouter.post("/element", createElement)
spaceRouter.delete("/element", userMiddleware, deleteElement)
export default spaceRouter