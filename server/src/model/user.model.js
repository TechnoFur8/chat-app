import { DataTypes } from "sequelize"
import sequelize from "../lib/db.js"

const User = sequelize.define("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    fullName: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    img: {type: DataTypes.STRING, allowNull: true}
})

export default User