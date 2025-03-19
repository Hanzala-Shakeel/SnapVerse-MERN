const mongoose = require("../config/databaseConfig");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    gender: {
        type: String, enum: ["male", "female"],
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId, ref: "post"
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId, ref: "user"
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId, ref: "user"
    }],
    savedPosts: [{
        type: mongoose.Schema.Types.ObjectId, ref: "post"
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model("user", userSchema);