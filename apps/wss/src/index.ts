import express from 'express'
// import client from '@meta/db/client'
const app = express()
import http from 'http'
import { playersSchema } from './types/interfaces'
const server = http.createServer(app)


import { Server } from 'socket.io'
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    },
    pingInterval: 2000,
    pingTimeout: 4000,
})
interface Square {
    x: number;
    y: number;
    size: number;
}

let players: playersSchema = {}
io.on('connection', (socket) => {
    console.log('Player connected with socket id: ', socket.id);

    // Assign a random position to the new player
    const randomX = Math.floor(Math.random() * 769);
    const randomY = Math.floor(Math.random() * 449);
    players[socket.id] = { x: randomX, y: randomY, avatarImage: '', name: '' };

    // Notify the new player and all existing players
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

    // Log current player positions
    console.log('Current players:', players);

    // Movement handler
    socket.on('movePlayer', ({ dx, dy }) => {
        const player = players[socket.id];
        if (player) {
            const newX = Math.max(0, Math.min(player.x + dx, 768));
            const newY = Math.max(0, Math.min(player.y + dy, 448));

            if (!checkCollisionWithGroup({ x: newX, y: newY, size: 32 }, socket.id)) {
                player.x = newX;
                player.y = newY;
                io.emit('newPlayer', players); // Update all clients
            } else {
                console.log(`Collision detected for player ${socket.id}`);
                socket.emit('collision', { x: player.x, y: player.y }); // Notify client
            }
        }
    });

    // Disconnection handler
    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        delete players[socket.id];
        io.emit('newPlayer', players); // Notify clients about the player leaving
    });
});

const PORT = process.env.PORT || 3002
server.listen(PORT, () => {
    console.log(`websocket running on port: ${PORT}`)
})