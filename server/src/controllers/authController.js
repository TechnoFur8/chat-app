import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/utils.js"
import User from "../model/user.model.js"
import bcrypt from "bcryptjs"

class AuthController {
    async signup(req, res) {
        const { fullName, email, password } = req.body
        

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Заполните все поля" })
        }

        try {
            if (password.length < 8) {
                return res.status(400).json({ message: "Пароль должен быть не менее 8 символов" })
            }

            const user = await User.findOne({ where: { email } })

            if (user) {
                return res.status(400).json({ message: "Пользователь с таким email уже существует" })
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            const newUser = await User.create({ fullName, email, password: hashedPassword })

            generateToken(newUser.id, res)

            const signupUser = await User.findByPk(newUser.id, { attributes: { exclude: ["password"] } })
            const token = req.cookies.jwt

            return res.status(201).json({ signupUser, token })

        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Что-то пошло не так" })
        }
    }

    async login(req, res) {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Заполните все поля" })
        }

        try {
            const user = await User.findOne({ where: { email } })

            if (!user) {
                return res.status(400).json({ message: "Пользователь с таким email не найден" })
            }

            const isPassword = await bcrypt.compare(password, user.password)

            if (!isPassword) {
                return res.status(400).json({ message: "Неверный пароль" })
            }

            generateToken(user.id, res)

            const loginUser = await User.findByPk(user.id, { attributes: { exclude: ["password", "createdAt", "updatedAt"] } })
            const token = req.cookies.jwt

            return res.status(200).json({ loginUser, token })

        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Что-то пошло не так" })
        }
    }

    async logout(req, res) {
        try {
            res.cookie("jwt", "", { maxAge: 0 })
            res.status(200).json({ message: "Вы успешно вышли" })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Что-то пошло не так" })
        }
    }

    async updateProfil(req, res) {
        const { img, name, email } = req.body
        const userId = req.user.id

        if (!img) {
            return res.status(400).json({ message: "Заполните все поля" })
        }


        try {
            const uploadResponse = await cloudinary.uploader.upload(img)

            await User.update({ img: uploadResponse.secure_url, fullName: name, email }, { where: { id: userId } })

            const userUpdate = await User.findByPk(userId)

            res.status(200).json({ userUpdate, message: "Профиль обновлен" })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Что-то пошло не так" })
        }
    }

    async getAllUser(req, res) {
        try {
            const user = await User.findAll({ attributes: { exclude: ["password"] } })
            return res.status(200).json({ user })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Что-то пошло не так" })
        }
    }

    async getOneUser(req, res) {
        try {
            const { userId } = req.params

            const user = await User.findByPk(userId, { attributes: { exclude: ["password"] } })
            return res.status(200).json(user)
        } catch (err) {
            console.error(err)
        }
    }

    async checkAuth(req, res) {
        const user = req.user.id

        try {
            const checkUser = await User.findByPk(user, { attributes: { exclude: ["password"] } })

            res.status(200).json(checkUser)
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Что-то пошло не так" })
        }
    }
}

export default new AuthController()