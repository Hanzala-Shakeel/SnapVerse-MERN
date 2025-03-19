const mongoose = require("../config/databaseConfig");

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId, ref: "user"
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId, ref: "message"
    }]
})

module.exports = mongoose.model("conversation", conversationSchema);