import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js"
import Message from "../model/message.model.js"
import { Op } from "sequelize"

class MessageController {
    // async getUser(req, res) {
    //     const userId = req.user.id

    //     try {
    //         const filterUser = await User.findAll({ where: { id: { [sequelize.Op.ne]: userId } }, attributes: { exclude: ["password"], raw: true } })

    //         res.status(200).json(filterUser)

    //     } catch (err) {
    //         console.error(err)
    //         return res.status(500).json({ message: "Что-то пошло не так" })
    //     }
    // }

    async getMessages(req, res) {
        const { id: userToChatId } = req.params
        const myId = req.user.id

        if (!userToChatId) {
            return res.status(400).json({ message: "ID пользователя не найден" })
        }

        try {
            const messages = await Message.findAll({
                where: {
                    [Op.or]: [
                        { senderId: myId, receiverId: userToChatId },
                        { senderId: userToChatId, receiverId: myId }
                    ]
                },
                order: [["createdAt", "ASC"]]
            })

            return res.status(200).json(messages)
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Что-то пошло не так" })
        }
    }

    async sendMessage(req, res) {
        const { text, img } = req.body
        const { id: receiverId } = req.params
        const senderId = req.user.id

        try {
            let imageUrl

            if (img) {
                const uploadResponse = await cloudinary.uploader.upload(img)
                imageUrl = uploadResponse.secure_url
            }

            const message = await Message.create({ senderId, receiverId, text, img: imageUrl })

            const receiverSocketId = getReceiverSocketId(receiverId)
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("message", message)
            }

            return res.status(201).json(message)

        } catch (err) {
            console.error(err)
        }
    }

    async messegeRead(req, res) {
        try {
            const { chatId } = req.params
            const myId = req.user.id

            console.log(chatId);


            await Message.update({ readUserMessage: true }, { where: { senderId: chatId, receiverId: myId, readUserMessage: false } })

            const receiverSocketId = getReceiverSocketId(chatId)
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("message-read", { chattedWith: myId })
            }

            return res.status(200).json({ message: "Сообщение прочитано" })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Что-то пошло не так" })
        }
    }
}

export default new MessageController()