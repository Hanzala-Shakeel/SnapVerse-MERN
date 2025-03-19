const userModel = require("../models/userModel");
const postModel = require("../models/postModel");
const commentModel = require("../models/commentModel");
const uploadImage = require("../services/uploadImage");
const sharp = require("sharp");
const { io, getReceiverSocketId } = require("../socket/socket");

const createPost = async (req, res) => {
    try {
        const userId = req.user._id;
        const postImage = req.file;

        if (!postImage) {
            return res.status(400).send("Please provide an image");
        }

        // Optimize image using sharp
        const optimizedImageBuffer = await sharp(postImage.buffer)
            .resize({ width: 800 }) // Resize image to width of 800px (adjust as needed)
            .toBuffer();

        // Upload the optimized image
        const postImageUrl = await uploadImage({ buffer: optimizedImageBuffer });

        // Create new post with optimized image URL
        const newPost = await postModel.create({
            caption: req.body.caption,
            image: postImageUrl,
            author: userId,
        });

        const user = await userModel.findById(userId);
        user.posts.push(newPost._id);

        await user.save();

        await newPost.populate('author', '-password');

        res.status(201).send({ message: "Post created successfully", newPost });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getAllPosts = async (req, res) => {
    try {
        const allPosts = await postModel.find()
            .sort({ createdAt: - 1 })
            .populate({ path: "author", select: "username profilePicture" })
            .populate({
                path: "comments",
                sort: { createdAt: - 1 },
                populate: { path: "author", select: "username profilePicture" }
            })
        if (!allPosts) return res.status(404).send("no post found");
        res.status(200).send(allPosts);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

const getUserPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const allPosts = await postModel.find({ author: userId })
            .sort({ createdAt: - 1 })
            .populate({ path: "author", select: "username profilePicture" })
            .populate({
                path: "comments",
                sort: { createdAt: - 1 },
                populate: { path: "author", select: "username profilePicture" }
            })
        if (!allPosts) return res.status(404).send("no post found");
        res.status(200).send(allPosts);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

const likeOrDislike = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.id;

        const post = await postModel.findById(postId);
        if (!post) return res.status(404).send("Post not found");

        // Check if user already liked the post
        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            // User already liked, so dislike
            await postModel.findByIdAndUpdate(postId, { $pull: { likes: userId } });
            // implement socket io for realtime like
            const user = await userModel.findById(userId).select("username profilePicture");
            const postOwnerId = post.author.toString();
            if (postOwnerId !== userId) {
                // emit a notification event
                const notification = {
                    type: "dislike",
                    userId: userId,
                    userDetails: user,
                    postId,
                    message: "Your post was disliked"
                }
                const postOwnerSocketId = getReceiverSocketId(postOwnerId);
                io.to(postOwnerSocketId).emit("notification", notification)
            }
            res.status(200).send("Post disliked successfully");
        } else {
            // User hasn't liked, so like the post
            await postModel.findByIdAndUpdate(postId, { $addToSet: { likes: userId } });
            // implement socket io for realtime like
            const user = await userModel.findById(userId).select("username profilePicture");
            const postOwnerId = post.author.toString();
            if (postOwnerId !== userId) {
                // emit a notification event
                const notification = {
                    type: "like",
                    userId: userId,
                    userDetails: user,
                    postId,
                    message: "Your post was liked"
                }
                const postOwnerSocketId = getReceiverSocketId(postOwnerId);
                io.to(postOwnerSocketId).emit("notification", notification)
            }

            res.status(200).send("Post liked successfully");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
}

const addComment = async (req, res) => {
    try {
        const userId = req.user._id;
        const post = await postModel.findById(req.params.id)
        const newComment = await commentModel.create({
            text: req.body.text,
            author: userId,
            post: post._id
        })
        // Populate author after creating the comment
        await newComment.populate({ path: "author", select: "username profilePicture" });
        post.comments.push(newComment._id);
        await post.save();
        res.status(200).send({ message: "comment added succesfully", newComment });
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

const getPostComments = async (req, res) => {
    try {
        const postId = req.params.id;
        const postComments = await commentModel.find({ post: postId }).populate("author", "username profilePicture");
        if (!postComments) return res.status(404).send("no comments yet");
        res.status(200).send(postComments);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

const deletePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.id;

        const postToDelete = await postModel.findById(postId);
        if (!postToDelete) return res.status(404).send("post not found");

        if (postToDelete.author.toString() !== userId) return res.status(403).send("unauthorized");

        await postModel.findByIdAndDelete(postId);
        const author = await userModel.findById(userId);
        const index = author.posts.indexOf(postId);
        if (index !== - 1) {
            author.posts.splice(index, 1)
            await author.save();
        }
        await commentModel.deleteMany({ post: postId });

        res.status(200).send("post deleted successfully");
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

const savedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.id;

        // Fetch the user from the database
        const user = await userModel.findById(userId);

        // Check if the post is already saved
        if (user.savedPosts.includes(postId)) {
            // Remove the post from savedPosts
            user.savedPosts.pull(postId);
            await user.save();
            return res.status(200).send("Post unsaved successfully");
        }

        // Add the post to savedPosts
        user.savedPosts.push(postId);
        await user.save();
        return res.status(200).send("Post saved successfully");

    } catch (err) {
        return res.status(500).send(err.message);
    }
};


module.exports = { createPost, getAllPosts, getUserPosts, likeOrDislike, addComment, getPostComments, deletePost, savedPosts };