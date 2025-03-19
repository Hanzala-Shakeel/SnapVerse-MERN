const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logout, getProfile, editProfile, getSuggestedUser, followOrUnfollow, getUserFollowers, getUserFollowing } = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/profile/:id", verifyToken, getProfile);
router.post("/profile/edit", verifyToken, upload.single("profilePicture"), editProfile);
router.get("/suggested", verifyToken, getSuggestedUser);
router.post("/followorunfollow/:id", verifyToken, followOrUnfollow);
router.get("/getuserfollowers/:id", verifyToken, getUserFollowers);
router.get("/getuserfollowing/:id", verifyToken, getUserFollowing);

router.get("/checklogin", verifyToken, (req, res) => {
    // If the token is valid, it will reach here
    res.status(200).send("user is logged in");
});

module.exports = router;