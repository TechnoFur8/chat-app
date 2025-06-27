import { Server } from "socket.io"
import http from "http"
import express from "express"

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
    }
})

export function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}

const userSocketMap = {}
const disconnectTimers = {}
const callRooms = {}
const callTimeouts = {}

io.on("connection", (socket) => {
    console.log("Пользователь подключился", socket.id)

    const userId = socket.handshake.query.userId

    if (userId && disconnectTimers[userId]) {
        clearTimeout(disconnectTimers[userId])
        delete disconnectTimers[userId]
        console.log("Таймер очищен для пользователя", userId)
    }

    if (userId) userSocketMap[userId] = socket.id

    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("call:offer", ({ to, offer, callerId, callerName }) => {
        const receiverSocketId = userSocketMap[to]

        if (receiverSocketId) {
            if (callTimeouts[socket.id]) {
                clearTimeout(callTimeouts[socket.id])
                delete callTimeouts[socket.id]
            }

            callTimeouts[socket.id] = setTimeout(() => {
                socket.to(receiverSocketId).emit("call:timeout", {
                    from: socket.id
                })
                socket.emit("call:timeout", {
                    to: to
                })
                delete callTimeouts[socket.id]
                console.log(`Таймаут звонка от ${socket.id} к ${to}`)
            }, 60000)

            socket.to(receiverSocketId).emit("call:offer", {
                offer, callerId, callerName, from: socket.id
            })
            console.log(`Звонок от ${callerId} к ${to}`)
        }
    })

    const clearCallTimeout = (socketId) => {
        if (callTimeouts[socketId]) {
            clearTimeout(callTimeouts[socketId])
            delete callTimeouts[socketId]
        }
    }

    socket.on("call:answer", ({ to, answer }) => {
        clearCallTimeout(socket.id)

        const receiverSocketId = userSocketMap[to]

        if (receiverSocketId) {
            socket.to(receiverSocketId).emit("call:answer", {
                answer, from: socket.id
            })
            console.log(`Ответ на звонок от ${socket.id} к ${to}`)
        }
    })

    socket.on("call:ice-candidate", ({ to, candidate }) => {

        const receiverSocketId = userSocketMap[to]

        if (receiverSocketId) {
            socket.to(receiverSocketId).emit("call:ice-candidate", {
                candidate, from: socket.id
            })
        }
    })

    socket.on("call:reject", ({ to, reason }) => {
        clearCallTimeout(socket.id)

        const receiverSocketId = userSocketMap[to]

        if (receiverSocketId) {
            socket.to(receiverSocketId).emit("call:reject", {
                reason, from: socket.id
            })
            console.log(`Звонок отклонен от ${socket.id} к ${to}`)
        }
    })

    socket.on("call:end", ({ to }) => {
        const receiverSocketId = userSocketMap[to]
        console.log("call:end to:", to, "receiverSocketId:", receiverSocketId)
        if (receiverSocketId) {
            socket.to(receiverSocketId).emit("call:end", {
                from: socket.id
            })
            console.log(`Звонок завершен от ${socket.id} к ${to}`)
        }
    })

    socket.on("call:busy", ({ to }) => {
        const receiverSocketId = userSocketMap[to]

        if (receiverSocketId) {
            socket.to(receiverSocketId).emit("call:busy", {
                from: socket.id
            })
            console.log(`Занято от ${socket.id} к ${to}`)
        }
    })

    socket.on("disconnect", () => {
        clearCallTimeout(socket.id)

        console.log("Инициализация отключения", socket.id)

        let disconnectUserId = null
        for (const [userId, isId] of Object.entries(userSocketMap)) {
            if (isId === socket.id) {
                disconnectUserId = userId
                break
            }
        }

        if (disconnectUserId) {
            for (const [userId, isId] of Object.entries(userSocketMap)) {
                if (userId !== disconnectUserId) {
                    io.to(isId).emit("call:end", { from: socket.id })
                }
            }
        }

        disconnectTimers[userId] = setTimeout(() => {
            console.log("Пользователь отключился", socket.id)
            delete userSocketMap[userId]
            delete disconnectTimers[userId]
            io.emit("getOnlineUsers", Object.keys(userSocketMap))
        }, 3000)
    })
})

export { io, app, server }
