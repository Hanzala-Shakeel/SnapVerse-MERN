const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const createToken = require("../services/createToken");
const uploadImage = require("../services/uploadImage");
const postModel = require("../models/postModel");

const registerUser = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (user) return res.status(400).send("you already have an account please login!");
        const userName = await userModel.findOne({ username: req.body.username });
        if (userName) return res.status(400).send("this username is already taken");
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        const newUser = await userModel.create({ ...req.body, password: hash });
        const token = createToken(newUser); // Generate the token
        res.cookie('token', token, {
            secure: true,     // Cookie only sent over HTTPS
            httpOnly: true,   // Cookie cannot be accessed via JavaScript
            sameSite: 'strict', // Helps prevent CSRF attacks
            maxAge: 1 * 24 * 60 * 60 * 1000
        });
        res.status(201).send("Account created successfully");
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const loginUser = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("email or password is incorrect");
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) return res.status(400).send("email or password is incorrect");

        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await postModel.findById(postId);
                if (post.author.equals(user._id)) {
                    return post;
                }
                return null;
            })
        )

        const LoggedInUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts,
            savedPosts: user.savedPosts
        }

        const token = createToken(user); // Generate the token
        res.cookie('token', token, {
            secure: true,     // Cookie only sent over HTTPS
            httpOnly: true,   // Cookie cannot be accessed via JavaScript
            sameSite: 'strict', // Helps prevent CSRF attacks
            maxAge: 1 * 24 * 60 * 60 * 1000
        });
        res.status(200).send({ message: `Welcome back ${user.username}`, LoggedInUser });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const logout = (req, res) => {
    if (!req.cookies.token) {
        return res.status(400).send("No active session found.");
    }
    res.clearCookie("token");
    res.status(200).send("Logged out successfully");
};

const getProfile = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await userModel.findById(userId)
            .select("-password")
            .populate({
                path: "posts",
                options: { sort: { createdAt: -1 } }, // Sort posts by createdAt descending
                populate: [
                    { path: "author" }, // Populate author of each post
                    {
                        path: "comments", // Populate comments inside each post
                        populate: { path: "author" } // Populate author of each comment
                    }
                ]
            })
            // Populate savedPosts if needed
            .populate({
                path: "savedPosts",
                options: { sort: { createdAt: -1 } }, // Sort posts by createdAt descending
                populate: [
                    { path: "author" }, // Populate author of each post
                    {
                        path: "comments", // Populate comments inside each post
                        populate: { path: "author" } // Populate author of each comment
                    }
                ]
            })
        if (!user) return res.status(400).send("user not found");
        res.status(200).send(user);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

const editProfile = async (req, res) => {
    try {
        const userId = req.user._id
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let imageUrl;
        if (profilePicture) {
            imageUrl = await uploadImage(profilePicture);
        }
        const user = await userModel.findById(userId).select("-password");
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = imageUrl;
        await user.save();
        res.status(200).send({ message: "profile updated", user });
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

const getSuggestedUser = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find the current user to get their list of following users
        const currentUser = await userModel.findById(userId).select("following");

        if (!currentUser) {
            return res.status(404).send("Current user not found");
        }

        // Exclude users that the current user is already following
        const suggestedUsers = await userModel
            .find({ 
                _id: { $ne: userId, $nin: currentUser.following } // Exclude the current user and already followed users
            })
            .select("-password") // Exclude the password field
            .sort({ createdAt: -1 }) // Sort by creation date (newest first)
            .limit(5); // Limit to 5 results

        if (suggestedUsers.length === 0) {
            return res.status(404).send("No other users found");
        }

        res.status(200).send(suggestedUsers);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.user._id; // hanzala
        const jiskoFollowKrunga = req.params.id; // harsh
        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).send("You cannot follow/unfollow yourself");
        }
        const user = await userModel.findById(followKrneWala);
        const targetUser = await userModel.findById(jiskoFollowKrunga);
        if (!user || !targetUser) {
            return res.status(400).send("User not found");
        }
        // mai check krunga ki follow krna hai ya unfollow
        const isFollowing = user.following.includes(jiskoFollowKrunga);
        if (isFollowing) {
            //unfollow logic ayega
            await Promise.all([
                userModel.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                userModel.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
            ])
            return res.status(200).send("Unfollowed successfully");
        } else {
            // follow logic ayega
            await Promise.all([
                userModel.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                userModel.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
            ])
            return res.status(200).send("followed successfully");
        }
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

const getUserFollowers = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId).select("followers").populate({ path: "followers", select: "username profilePicture" });
        if (!user) return res.status(404).send("user not found");
        return res.status(200).send(user);
    }
    catch (err) {
        res.status(500).send(err.message)
    }

}

const getUserFollowing = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId).select("following").populate({ path: "following", select: "username profilePicture" });
        if (!user) return res.status(404).send("user not found");
        return res.status(200).send(user);
    }
    catch (err) {
        res.status(500).send(err.message)
    }

}

module.exports = { registerUser, loginUser, logout, getProfile, editProfile, getSuggestedUser, followOrUnfollow, getUserFollowers, getUserFollowing };