const conversationModel = require("../models/conversationModel");
const messageModel = require("../models/messageModel");
const { getReceiverSocketId } = require("../socket/socket");
const { io } = require("../socket/socket");

const sendMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const receiverId = req.params.id;
        const { message } = req.body
        console.log("message", req.body);

        let conversation = await conversationModel.findOne({
            participants: { $all: [senderId, receiverId] }
        })
        // established the conversation if not started yet
        if (!conversation) {
            conversation = await conversationModel.create({
                participants: [senderId, receiverId],
            })
        }
        const newMessage = await messageModel.create({
            senderId,
            receiverId,
            message
        })
        if (newMessage) conversation.messages.push(newMessage._id)
        await conversation.save();

        // impletent socket io for real time data transfer
        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).send(newMessage);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

const getMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const receiverId = req.params.id;
        const conversation = await conversationModel.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages")
        if (!conversation) return res.status(200).send({ messages: [] })
        res.status(200).send({ messages: conversation.messages })
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

const getChattedUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // Assuming the logged-in user's ID is available in req.user

        // Find conversations where the logged-in user is a participant
        const conversations = await conversationModel.find({
            participants: loggedInUserId
        }).populate({
            path: "participants",
            select: "-password" // Exclude password field
        });

        // Extract the other participants (users with whom the logged-in user has chatted)
        const chattedUsers = conversations.flatMap(conversation => {
            return conversation.participants.filter(participant => !participant._id.equals(loggedInUserId));
        });

        // Remove duplicates (in case of multiple conversations with the same users)
        const uniqueChattedUsers = Array.from(new Set(chattedUsers.map(user => user._id.toString())))
            .map(id => chattedUsers.find(user => user._id.toString() === id));

        return res.status(200).send(uniqueChattedUsers);
    } catch (error) {
        return res.status(500).send({ message: "An error occurred", error });
    }
};

module.exports = { sendMessage, getMessage, getChattedUsers };