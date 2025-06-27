import User from "./user.model.js"
import Message from "./message.model.js"

User.hasMany(Message)
Message.belongsTo(User)