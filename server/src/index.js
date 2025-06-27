import "dotenv"
import express from "express"
import router from "./routes/routes.js"
import sequelize from "./lib/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import { app, server } from "./lib/socket.js"


const PORT = process.env.PORT || 5000

app.use(express.json({ limit: "10mb" }))
app.use(cookieParser())

app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["POST", "GET", "PUT", "DELETE"]
}))

app.use("/api", router)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync({ alter: true })
        server.listen(PORT, () => console.log("Сервер работает на порту", PORT))
    } catch (err) {
        console.error(err)
    }
}

start()