const { Server } = require("socket.io");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: 'https://snapverse-rho.vercel.app',
//         methods: ['GET', 'POST']
//     }
// });

const io = new Server(server, {
    cors: {
        origin: 'https://snapverse-rho.vercel.app',
        methods: ['GET', 'POST'],
        credentials: true // Ensure credentials (cookies) are allowed
    },
    transports: ['websocket', 'polling'], // Adding 'polling' as a fallback
});


const userSocketMap = {}; // This map stores socket id corresponding to user id; userId → socketId

const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User connected: UserId = ${userId}, SocketId = ${socket.id}`);
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        if (userId) {
            console.log(`User disconnected: UserId = ${userId}, SocketId = ${socket.id}`);
            delete userSocketMap[userId];
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

module.exports = { app, server, io, getReceiverSocketId };
