import jwt from "jsonwebtoken"

export const generateToken = (userId, res) => {

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "24h"
    })

    res.cookie("jwt", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
        domain: "chat-app-server-production-f321.up.railway.app"
    })

    return token
}