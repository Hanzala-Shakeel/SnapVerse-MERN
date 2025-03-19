require('dotenv').config();
require("./config/databaseConfig");
const express = require("express");
const { app, server } = require("./socket/socket");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./routes/index");

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true // Allow credentials (cookies) to be included
}));

app.use(cookieParser());

app.use("/", router);

server.listen(3000, () => {
    console.log("server is running on port 3000");
})