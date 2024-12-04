import { io } from 'socket.io-client'

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL

export const socket = io(SOCKET_SERVER_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
});

socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
});

socket.on('disconnect', () => {
    console.log('Socket disconnected');
});
