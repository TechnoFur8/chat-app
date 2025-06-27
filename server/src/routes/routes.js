import { Router } from "express"
import authRoutes from "./authRoutes.js"
import messageRoutes from "./messageRoutes.js"

const router = Router()

router.use("/auth", authRoutes)
router.use("/message", messageRoutes)

export default router