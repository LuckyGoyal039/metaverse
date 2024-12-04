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
    room: string
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
        origin: "http://localhost:5173"
    },
    pingInterval: 2000,
    pingTimeout: 4000,
})

io.on('connection', (socket) => {
    console.log('Player connected with socket id:', socket.id);

    socket.on('joinDemo', (data: { room: string; name: string }, callback) => {
        const room = data.room;
        const name = data.name;
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
            dy: 0,
            room: room
        };

        io.to(room).emit('newPlayer', getPlayersInRoom(room));
        // socket.to(room).emit('playerJoined', { id: socket.id, name });

        const systemMessage = {
            id: Math.random().toString(36).substr(2, 9),
            sender: 'System',
            content: `${name} has joined the chat`,
            timestamp: Date.now()
        };

        io.to(room).emit('chatMessage', systemMessage);
        callback?.(null);
    });

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
            dy: 0,
            room: room
        };

        io.to(room).emit('playerJoined', {
            room: room,
            players: getPlayersInRoom(room),
        });
    });

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

    socket.on('sendMessage', (messageData: { content: string; sender: string; room: string }, callback) => {
        console.log("Received messageData:", messageData);

        const message = {
            id: Math.random().toString(36).substr(2, 9),
            sender: messageData.sender,
            content: messageData.content,
            timestamp: Date.now()
        };

        console.log("Broadcasting message:", message);

        // Emit to ALL clients in the room, excluding the sender
        console.log("#####", socket.rooms);
        io.to(messageData.room).emit('chatMessage', message);

    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        console.log("disconnect call, ...current players: ", players)
        let playerRoom = ''
        if (socket.id) {
            playerRoom = players[socket.id]?.room
        }

        console.log('Player room:', playerRoom);

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
            io.to(playerRoom).emit('updatePlayers', {
                room: playerRoom,
                players: getPlayersInRoom(playerRoom),
            });
        }
    });

    // socket.on('test', (message) => {
    //     console.log('message:', message)
    //     socket.emit('test', message)
    // })
});

function getPlayersInRoom(room: string): Player[] {

    const data = Object.fromEntries(
        Object.entries(players).filter(([socketId]) => {
            const socket = io.sockets.sockets.get(socketId);
            return socket?.rooms.has(room);
        })
    );
    // console.log("io:", io)
    // console.log("ioz:", io.sockets.sockets)
    console.log("players data###", data)
    const connections = io.sockets.adapter.rooms.get(room)
    console.log("my connections $$$$", connections)
    return Object.values(players).filter(player => player.room === room);

}

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

const PORT = process.env.PORT || 3002
server.listen(PORT, () => {
    console.log(`websocket running on port: ${PORT}`)
})