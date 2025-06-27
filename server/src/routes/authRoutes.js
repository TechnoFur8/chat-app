import { Router } from "express"
import authController from "../controllers/authController.js"
import { protectRoute } from "../middleware/authMiddleware.js"

const router = Router()

router.post("/signup", authController.signup)
router.post("/login", authController.login)
router.post("/logout", authController.logout)
router.put("/update-profil", protectRoute, authController.updateProfil)
router.get("/users", protectRoute, authController.getAllUser)
router.get("/check", protectRoute, authController.checkAuth)
router.get("/user/:userId", authController.getOneUser)

export default router