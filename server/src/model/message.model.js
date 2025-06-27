import { DataTypes } from "sequelize"
import sequelize from "../lib/db.js"

const Message = sequelize.define("message", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT, allowNull: false },
    img: { type: DataTypes.STRING, allowNull: true },
    senderId: { type: DataTypes.INTEGER, allowNull: false },
    receiverId: { type: DataTypes.INTEGER, allowNull: false },
    readUserMessage: {type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false}
})

export default Message