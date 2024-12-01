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

    //demo room
    socket.on('joinDemo', (name) => {
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
        io.to(room).emit('newPlayer', getPlayersInRoom(room));
        socket.to(room).emit('playerJoined', { id: socket.id, name });
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
        console.log("xxxxxxxxxxxx..........xxxxx", playersInRoom)
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

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        const playerRoom = getPlayerRoom(socket.id);
        if (playerRoom) {
            delete players[socket.id];
            io.to(playerRoom).emit('updatePlayers', {
                room: playerRoom,
                players: getPlayersInRoom(playerRoom),
            });
        }
    });
    console.log("current players: ", players)
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
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                return room;
            }
        }
    }
    return null;
};


const PORT = process.env.PORT || 3002
server.listen(PORT, () => {
    console.log(`websocket running on port: ${PORT}`)
})