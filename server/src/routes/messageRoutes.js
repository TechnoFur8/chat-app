import { Router } from "express"
import { protectRoute } from "../middleware/authMiddleware.js"
import messageController from "../controllers/messageController.js"

const router = Router()

// router.get("/user", protectRoute, messageController.getUser)
router.get("/:id", protectRoute, messageController.getMessages)
router.post("/send/:id", protectRoute, messageController.sendMessage)
router.put("/read/:chatId", protectRoute, messageController.messegeRead)

export default router