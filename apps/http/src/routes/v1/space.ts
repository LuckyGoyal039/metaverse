import { Router } from "express";
import { userMiddleware } from "../../middleware/user";
import { createSpace, deleteSpace } from "../../controllers/space";

const spaceRouter = Router()

spaceRouter.post("/", userMiddleware, createSpace)
spaceRouter.delete("/:spaceId", (req, res) => {

})
spaceRouter.delete("/all", (req, res) => {

})
spaceRouter.get("/:spaceId", userMiddleware, deleteSpace)
spaceRouter.post("/element", (req, res) => {

})
spaceRouter.delete("/element", (req, res) => {

})
export default spaceRouter