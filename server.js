const express = require("express");
const app = express();
const http = require("http");
const path = require('path');
const { Server } = require("socket.io");
const ACTIONS = require("./src/Actions");
const PORT = process.env.PORT || 5005; 

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('build'));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.use(express.static('build'));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const userSocketMap = {}; // {socketId: username}

function getAllConnectedClients(roomId) { 
    //Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
       }
   });
}

io.on("connection", (socket) => {
    console.log("socket is connected", socket.id);

    socket.on(ACTIONS.JOIN, ({roomId, username}) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);

        // get list of all clients in room
        const clients = getAllConnectedClients(roomId);
        // console.log("clients", clients);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED,{
                clients,
                username,//username: username (key value same)
                socketId: socket.id,
            });
        })
    })

// listen the event and emit the event_________________________________________________________
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {

        // console.log("received code change event", code);
        // Now we will emit the event to all the clients in the room
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });

        //socket in means all the clients in the room except the sender
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    

// Listen for the disconnecting event and emit the disconnected event___________________________
    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],

            });
        });

        delete userSocketMap[socket.id];
        socket.leave();

    });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

