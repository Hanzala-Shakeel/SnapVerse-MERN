const mongoose = require("../config/databaseConfig");

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: "user", required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId, ref: "user", required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("comment", commentSchema);