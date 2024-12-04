import express from 'express'
const app = express()
import http from 'http'
import { Server } from 'socket.io'

interface Square {
    x: number;
    y: number;
    size: number;
}

interface Player {
    x: number;
    y: number;
    avatarImage: string;
    name: string;
    dx?: number;
    dy?: number;
}

interface ChatMessage {
    sender: string;
    content: string;
    room: string;
}

let players: Record<string, Player> = {}

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true
    },
    pingInterval: 2000,
    pingTimeout: 4000,
})

io.on('connection', (socket) => {
    console.log('Player connected with socket id:', socket.id);

    //demo room
    socket.on('joinDemo', (name, callback) => {
        const room = 'demo-room';
        socket.join(room);
        console.log(`${name} joined ${room}`);

        const randomX = Math.floor(Math.random() * 769);
        const randomY = Math.floor(Math.random() * 449);

        players[socket.id] = {
            x: randomX,
            y: randomY,
            avatarImage: '',
            name: name || "Unknown",
            dx: 0,
            dy: 0
        };

        // Send join confirmation
        callback({ success: true });

        io.to(room).emit('newPlayer', getPlayersInRoom(room));
        socket.to(room).emit('playerJoined', { id: socket.id, name });

        const systemMessage = {
            id: Math.random().toString(36).substr(2, 9),
            sender: 'System',
            content: `${name} has joined the chat`,
            timestamp: Date.now()
        };

        io.to('demo-room').emit('chatMessage', systemMessage);
    });

    // not working 
    socket.on('joinRoom', ({ room, name }) => {
        socket.join(room);
        console.log(`Player ${name} joined room ${room}`);

        const randomX = Math.floor(Math.random() * 769);
        const randomY = Math.floor(Math.random() * 449);

        players[socket.id] = {
            x: randomX,
            y: randomY,
            avatarImage: '',
            name: name || 'Unknown',
            dx: 0,
            dy: 0
        };

        io.to(room).emit('playerJoined', {
            room: room,
            players: getPlayersInRoom(room),
        });
    });
    const checkCollisionWithGroup = (squareA: Square, id: string, room: string): boolean => {
        const playersInRoom = getPlayersInRoom(room);
        for (const playerId in playersInRoom) {
            if (playerId !== id) {
                const squareB = playersInRoom[playerId];
                if (
                    squareA.x < squareB.x + 32 &&
                    squareA.x + 32 > squareB.x &&
                    squareA.y < squareB.y + 32 &&
                    squareA.y + 32 > squareB.y
                ) {
                    return true;
                }
            }
        }
        return false;
    };


    socket.on('movePlayer', ({ dx, dy, x, y, room }) => {
        const player = players[socket.id];
        if (player) {
            const newX = Math.max(0, Math.min(x, 768));
            const newY = Math.max(0, Math.min(y, 448));

            if (!checkCollisionWithGroup({ x: newX, y: newY, size: 32 }, socket.id, room)) {
                player.x = newX;
                player.y = newY;
                player.dx = dx;
                player.dy = dy;

                socket.to(room).emit('playerMoved', {
                    id: socket.id,
                    x: newX,
                    y: newY,
                    dx: dx,
                    dy: dy
                });
            } else {
                console.log(`Collision detected for player ${socket.id}`);
                socket.emit('collision', {
                    x: player.x,
                    y: player.y,
                    dx: 0,
                    dy: 0
                });
            }
        }
    });

    // socket.on('sendMessage', (messageData: { content: string; sender: string; room: string }) => {
    //     console.log("Received messageData:", messageData);

    //     const message = {
    //         id: Math.random().toString(36).substr(2, 9),
    //         sender: messageData.sender,
    //         content: messageData.content,
    //         timestamp: Date.now()
    //     };

    //     console.log("Broadcasting message:", message);
    //     // Emit to all clients in the room, exclude the sender
    //     socket.to(messageData.room).emit('chatMessage', message);

    // });

    socket.on('sendMessage', (messageData: { content: string; sender: string; room: string }, callback) => {
        console.log("Received messageData:", messageData);

        const message = {
            id: Math.random().toString(36).substr(2, 9),
            sender: messageData.sender,
            content: messageData.content,
            timestamp: Date.now()
        };

        console.log("Broadcasting message:", message);
        // Emit to ALL clients in the room, including the sender
        io.to(messageData.room).emit('chatMessage', message);

        // Send confirmation back to sender
        callback({ success: true, message });
    });
    socket.on('disconnect', () => {
        console.log('=== DISCONNECT DEBUG ===');
        console.log('Player disconnected:', socket.id);
        const playerRoom = getPlayerRoom(socket.id);
        console.log('Player room:', playerRoom);
        // console.log('Players before removal:', players);

        if (playerRoom && players[socket.id]) {
            const systemMessage = {
                id: Math.random().toString(36).substr(2, 9),
                sender: 'System',
                content: `${players[socket.id].name} has left the chat`,
                timestamp: Date.now()
            };
            io.to(playerRoom).emit('chatMessage', systemMessage);
        }


        if (playerRoom) {
            delete players[socket.id];
            const playersInRoom = getPlayersInRoom(playerRoom);
            console.log('Players after removal:', playersInRoom);
            console.log('Emitting updatePlayers event to room:', playerRoom);

            io.to(playerRoom).emit('updatePlayers', {
                room: playerRoom,
                players: playersInRoom,
            });
        }

    });
});

const getPlayersInRoom = (room: string): Record<string, Player> => {
    return Object.fromEntries(
        Object.entries(players).filter(([socketId]) => {
            const socket = io.sockets.sockets.get(socketId);
            return socket?.rooms.has(room);
        })
    );
};

const getPlayerRoom = (socketId: string): string | null => {
    console.log("socketId", socketId);
    const allSockets = Array.from(io.sockets.adapter.sids.get(socketId) || []);
    console.log("******: ", allSockets)
    // const myRooms = io.sockets.manager.roomClients[socketId]
    // console.log("myrooms: ", myRooms)
    const socket = io.sockets.sockets.get(socketId);
    console.log("socket detials:", socket);
    if (socket) {
        // Log all rooms for debugging
        console.log('All rooms for socket:', Array.from(socket.rooms));

        // Find the room that isn't the socket ID
        for (const room of socket.rooms) {
            console.log('Checking room:', room);
            if (room !== socketId && room !== undefined) {
                return room;
            }
        }

        // If we're here, check if the player is in the demo room
        // if (players[socketId]?.name?.room === 'demo-room') {
        //     return 'demo-room';
        // }
    }
    return null;
};


const PORT = process.env.PORT || 3002
server.listen(PORT, () => {
    console.log(`websocket running on port: ${PORT}`)
})