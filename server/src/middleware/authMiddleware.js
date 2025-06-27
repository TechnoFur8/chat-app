import jwt from "jsonwebtoken"
import User from "../model/user.model.js"

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt

        if (!token) {
            return res.status(401).json({ message: "Вы не авторизованы" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(401).json({ message: "Вы не авторизованы" })
        }

        const user = await User.findByPk(decoded.userId)

        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" })
        }

        req.user = user

        next()

    } catch (err) {
        console.error(err)
        return res.status(401).json({ message: "Пользователь не авторизован" })
    }
}