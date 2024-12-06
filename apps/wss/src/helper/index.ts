import { Server } from 'socket.io';
import playerManager from '../memoryStore/index';

interface ChatMessage {
    id?: string;
    sender: string;
    content: string;
    room: string;
    timestamp: number;
}

interface Square {
    x: number;
    y: number;
    size: number;
}

export const createSystemMessage = (content: string, room: string): ChatMessage => {
    return {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'System',
        content,
        room,
        timestamp: Date.now(),
    };
}

export const checkCollisionWithGroup = (
    squareA: Square, 
    id: string, 
    room: string, 
    io: Server
): boolean => {
    // Fetch players in the room using PlayerManager
    const playersInRoom = playerManager.getPlayersInRoom(room, io);

    // Loop through players in the room to check for collisions
    for (const [playerId, player] of playersInRoom.entries()) {
        if (playerId !== id) {  // Don't check collision with the current player
            // Check for a collision using simple bounding box collision detection
            if (
                squareA.x < player.x + 32 &&
                squareA.x + squareA.size > player.x &&
                squareA.y < player.y + 32 &&
                squareA.y + squareA.size > player.y
            ) {
                return true;  // Collision detected
            }
        }
    }

    return false;  // No collision
};