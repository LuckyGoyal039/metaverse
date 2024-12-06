import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import playerManager from './memoryStore';
import { checkCollisionWithGroup, createSystemMessage } from './helper';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true
    },
    pingInterval: 2000,
    pingTimeout: 4000,
});

io.on('connection', (socket: Socket) => {
    console.log('Player connected with socket id:', socket.id);

    // Join Room Handler
    socket.on('joinRoom', (data: { name: string; room: string }, callback) => {
        const { name, room } = data;
        console.log(`player ${name}join in room: ${room}`)

        if (!room) {
            // return callback({ success: false, message: 'Room is required.' });
        }

        socket.join(room);

        const newPlayer = {
            x: Math.floor(Math.random() * 769),
            y: Math.floor(Math.random() * 449),
            avatarImage: '',
            name: name || "Unknown",
            dx: 0,
            dy: 0,
            room: room
        };
        playerManager.addPlayer(socket.id, newPlayer);

        // Broadcast to room
        io.to(room).emit('newPlayer', Array.from(playerManager.getPlayersInRoom(room, io).entries()));
        socket.to(room).emit('playerJoined', { id: socket.id, name: newPlayer.name });

        const systemMessage = createSystemMessage(`${newPlayer.name} has joined the chat`, room);
        io.to(room).emit('chatMessage', systemMessage);
    });

    // Move Player Handler
    socket.on('movePlayer', ({ dx, dy, x, y, room }: { dx: number, dy: number, x: number, y: number, room: string }) => {
        const player = playerManager.getPlayer(socket.id);
        if (!player) return;

        const newX = Math.max(0, Math.min(x, 768));
        const newY = Math.max(0, Math.min(y, 448));

        if (!checkCollisionWithGroup({ x: newX, y: newY, size: 32 }, socket.id, room, io)) {
            player.x = newX;
            player.y = newY;
            player.dx = dx;
            player.dy = dy;

            socket.to(room).emit('playerMoved', {
                id: socket.id,
                x: newX,
                y: newY,
                dx,
                dy
            });
        } else {
            socket.emit('collision', {
                x: player.x,
                y: player.y,
                dx: 0,
                dy: 0
            });
        }
    });

    // Send Message Handler
    socket.on('sendMessage', (
        messageData: { content: string; sender: string; room: string },
        callback
    ) => {
        console.log("send message trigger: ");
        console.log(messageData)
        const message = {
            id: Math.random().toString(36).substr(2, 9),
            sender: messageData.sender,
            content: messageData.content,
            timestamp: Date.now()
        };

        io.to(messageData.room).emit('chatMessage', message);
        callback({ success: true, message });
    });

    socket.on('disconnecting', (reason) => {
        // At this stage, rooms are still available
        const rooms = Array.from(socket.rooms);
        const playerRoom = rooms.find(room => room !== socket.id);

        // You can now store this room or use it in the disconnect handler
        socket.context = { playerRoom };
    });

    socket.on('disconnect', () => {
        // Dynamically find the room the player was in
        // const playerRoom = socket.context?.playerRoom;

        const player = playerManager.getPlayer(socket.id);
        const playerRoom = player?.room;

        if (!playerRoom) {
            console.log('No room found for disconnected player');
            return;
        }
        if (player) {
            const systemMessage = {
                id: Math.random().toString(36).substr(2, 9),
                sender: 'System',
                content: `${player.name} has left the chat`,
                timestamp: Date.now()
            };

            io.to(playerRoom).emit('chatMessage', systemMessage);
        }

        playerManager.removePlayer(socket.id);
        const playersInRoom = playerManager.getPlayersInRoom(playerRoom, io);

        io.to(playerRoom).emit('updatePlayers', {
            players: Array.from(playersInRoom.entries())
        });
    });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3002;
server.listen(PORT, () => {
    console.log(`WebSocket server running on port: ${PORT}`);
});

export { server, io };