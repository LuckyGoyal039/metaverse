import { Router } from "express";
import { userMiddleware } from "../../middleware/user";
import { createSpace, deleteSpace, getMySpace } from "../../controllers/space";

const spaceRouter = Router()

spaceRouter.post("/", userMiddleware, createSpace)
spaceRouter.delete("/:spaceId", (req, res) => {

})
spaceRouter.delete("/all", userMiddleware, getMySpace)
spaceRouter.get("/:spaceId", userMiddleware, deleteSpace)
spaceRouter.post("/element", (req, res) => {

})
spaceRouter.delete("/element", (req, res) => {

})
export default spaceRouter