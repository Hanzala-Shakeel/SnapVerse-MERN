const express = require("express");
const router = express.Router();
const { sendMessage, getMessage, getChattedUsers } = require("../controllers/messageController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/send/:id", verifyToken, sendMessage);
router.get("/all/:id", verifyToken, getMessage);
router.get("/getchatteduser", verifyToken, getChattedUsers);


module.exports = router;