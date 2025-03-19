const mongoose = require("../config/databaseConfig");

const postSchema = new mongoose.Schema({
    caption: { type: String, required: true },
    image: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: "user", required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId, ref: "user"
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId, ref: "comment"
    }],
}, {
    timestamps: true
})

module.exports = mongoose.model("post", postSchema);