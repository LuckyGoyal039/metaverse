import React, { useState, useEffect, useRef, useCallback } from 'react';
import { socket } from '../../socket';

interface Message {
    id: string;
    sender: string;
    content: string;
    timestamp: number;
}

interface ChatProps {
    playerName: string | null;
    room: string;
}

const Chat: React.FC<ChatProps> = ({ playerName, room }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;

    const joinRoom = useCallback(() => {
        if (playerName && room && socket.connected) {
            console.log('Attempting to join room:', room);
            socket.emit(room, playerName, (response: { success: boolean }) => {
                if (response?.success) {
                    console.log('Successfully joined room');
                    setIsJoined(true);
                } else {
                    console.log('Failed to join room');
                    setIsJoined(false);
                }
            });
        }
    }, [playerName, room]);

    const reconnect = useCallback(() => {
        if (reconnectAttempts.current < maxReconnectAttempts) {
            console.log('Attempting to reconnect...');
            reconnectAttempts.current += 1;
            socket.connect();
        }
    }, []);

    useEffect(() => {
        const onConnect = () => {
            console.log('Socket connected!');
            setIsConnected(true);
            reconnectAttempts.current = 0;
            joinRoom();
        };

        const onDisconnect = (reason: string) => {
            console.log('Socket disconnected:', reason);
            setIsConnected(false);
            setIsJoined(false);

            if (reason === 'io server disconnect') {
                // Server disconnected us, try to reconnect
                reconnect();
            }
        };

        const onConnectError = (error: Error) => {
            console.log('Connection error:', error);
            setIsConnected(false);
            setIsJoined(false);

            // Try to reconnect with exponential backoff
            const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
            setTimeout(reconnect, timeout);
        };

        const onChatMessage = (message: Message) => {
            if (message.sender !== playerName) {
                console.log('Message received:', message);
                setMessages(prev => [...prev, message]);
            }
        };

        // Initial connection
        if (!socket.connected) {
            socket.connect();
        }

        // Setup event listeners
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('connect_error', onConnectError);
        socket.on('chatMessage', onChatMessage);

        // Cleanup function
        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('connect_error', onConnectError);
            socket.off('chatMessage', onChatMessage);
        };
    }, [playerName, joinRoom, reconnect]);

    // Auto-scroll effect
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !playerName || !isConnected || !isJoined) {
            console.log('Cannot send message:', {
                hasMessage: !!newMessage.trim(),
                hasPlayerName: !!playerName,
                isConnected,
                isJoined
            });
            return;
        }

        const messageData = {
            content: newMessage.trim(),
            sender: playerName,
            room: room
        };

        console.log('Sending message:', messageData);

        socket.timeout(5000).emit('sendMessage', messageData, (err: Error | null, response: { success: boolean, message?: Message }) => {
            if (err) {
                console.error('Message send timeout:', err);
                return;
            }

            if (response?.success && response?.message) {
                setMessages(prev => [...prev, response.message]);
                setNewMessage('');
            } else {
                console.error('Failed to send message');
            }
        });
    };

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed bottom-4 right-4 w-[500px] bg-[#111b21] rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 p-3 flex justify-between items-center">
                <h3 className="text-white font-semibold">
                    Chat Room: {room}
                    {!isJoined && isConnected && " (Joining...)"}
                </h3>
                <div className="flex items-center gap-2">
                    <span
                        className={`w-3 h-3 rounded-full ${isConnected && isJoined ? 'bg-green-400' :
                                isConnected ? 'bg-yellow-400' : 'bg-red-400'
                            }`}
                        title={
                            isConnected && isJoined ? 'Connected' :
                                isConnected ? 'Connecting to room...' : 'Disconnected'
                        }
                    />
                </div>
            </div>

            <div
                ref={chatContainerRef}
                className="h-96 overflow-y-auto p-4 space-y-2"
            >
                {messages.map((message, index) => (
                    <div
                        key={`${message.id}-${index}`}
                        className={`flex flex-col ${message.sender === playerName
                                ? 'items-end'
                                : 'items-start'
                            }`}
                    >
                        <div className={`max-w-[80%] rounded-lg p-2 ${message.sender === playerName
                                ? 'bg-blue-500 text-white'
                                : 'bg-[#202c33] text-white'
                            }`}>
                            <p className="text-sm font-semibold">
                                {message.sender}
                            </p>
                            <p className="break-words">
                                {message.content}
                            </p>
                            <p className="text-xs opacity-75">
                                {formatTimestamp(message.timestamp)}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form
                onSubmit={handleSendMessage}
                className="border-t p-3 flex gap-2"
            >
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={
                        !isConnected ? "Connecting..." :
                            !isJoined ? "Joining room..." :
                                "Type a message..."
                    }
                    disabled={!isConnected || !isJoined}
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none disabled:opacity-50 bg-[#202c33] text-white"
                />
                <button
                    type="submit"
                    disabled={!isConnected || !isJoined}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;