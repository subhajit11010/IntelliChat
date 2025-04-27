import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

let users = 0;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use('/public', express.static(join(__dirname, 'public')));
app.use('/res', express.static(join(__dirname, 'res')));

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    users++;
    io.emit('users count', users);
    console.log("A user connected!");

    // handle new user joining
    socket.on("new user", (username) => {
        socket.username = username;
        console.log(`${username} joined the chat`);
        socket.broadcast.emit('user joined', username); 
        // send to everyone except the sender
    });

    socket.on("chat message", (msg, username) => {
        console.log('message: ' + msg);
        socket.broadcast.emit('chat message', msg, username);
    });

    socket.on("disconnect", () => {
        users--;
        io.emit('users count', users);
        if (socket.username) {
            socket.broadcast.emit('user left', socket.username);
        }
        console.log("User disconnected!");
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log(`Server running at http://localhost:${process.env.PORT || 3000}`);
});