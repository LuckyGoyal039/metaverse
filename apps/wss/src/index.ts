import express from 'express'
const app = express()
import http from 'http'
import { Server } from 'socket.io'

interface Square {
    x: number;
    y: number;
    size: number;
}

// Updated player interface to include movement direction
interface Player {
    x: number;
    y: number;
    avatarImage: string;
    name: string;
    dx?: number;  // Added for animation
    dy?: number;  // Added for animation
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
    console.log('Player connected with socket id: ', socket.id);
    
    // Initialize new player
    const randomX = Math.floor(Math.random() * 769);
    const randomY = Math.floor(Math.random() * 449);
    players[socket.id] = { 
        x: randomX, 
        y: randomY, 
        avatarImage: '', 
        name: '',
        dx: 0,
        dy: 0
    };

    socket.emit('welcome', { message: "Joined space successfully", id: socket.id });
    io.emit('newPlayer', players);

    const checkCollisionWithGroup = (squareA: Square, id: string): boolean => {
        for (const playerId in players) {
            if (playerId !== id) {
                const squareB = players[playerId];
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

    // Updated movement handler
    socket.on('movePlayer', ({ dx, dy, x, y }) => {
        const player = players[socket.id];
        if (player) {
            const newX = Math.max(0, Math.min(x, 768));
            const newY = Math.max(0, Math.min(y, 448));

            if (!checkCollisionWithGroup({ x: newX, y: newY, size: 32 }, socket.id)) {
                player.x = newX;
                player.y = newY;
                player.dx = dx;
                player.dy = dy;

                // Broadcast movement to all other players
                socket.broadcast.emit('playerMoved', {
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
        delete players[socket.id];
        io.emit('newPlayer', players);
    });
});

const PORT = process.env.PORT || 3002
server.listen(PORT, () => {
    console.log(`websocket running on port: ${PORT}`)
})