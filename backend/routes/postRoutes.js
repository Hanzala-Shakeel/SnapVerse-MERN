const express = require("express");
const router = express.Router();
const { createPost, getAllPosts, getUserPosts, likeOrDislike, addComment, getPostComments, deletePost, savedPosts } = require("../controllers/postController");
const { verifyToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");


router.post("/create", verifyToken, upload.single("postImage"), createPost);
router.get("/all", verifyToken, getAllPosts);
router.get("/userposts", verifyToken, getUserPosts);
router.post("/likeordislike/:id", verifyToken, likeOrDislike);
router.post("/addcomment/:id", verifyToken, addComment);
router.get("/getcomments/:id", verifyToken, getPostComments);
router.delete("/delete/:id", verifyToken, deletePost);
router.post("/save/:id", verifyToken, savedPosts);


module.exports = router;