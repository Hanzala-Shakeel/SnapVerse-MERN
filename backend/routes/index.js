const express = require("express");

const router = express.Router();

const userRoutes = require("./userRoutes");
const postRoutes = require("./postRoutes");
const messageRoutes = require("./messageRoutes");

router.get("/", (req, res) => {
    res.send("working");
})

router.use("/user", userRoutes);
router.use("/post", postRoutes);
router.use("/message", messageRoutes);

module.exports = router;