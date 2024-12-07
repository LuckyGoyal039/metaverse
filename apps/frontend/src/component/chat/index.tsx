import React, { useState, useEffect, useRef, useCallback } from 'react';
import { socket } from '../../socket';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import chatBgImage from '../../assets/images/chat-bg-image.png'

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
    const [isConnected, setIsConnected] = useState(false);
    const [isJoined, setIsJoined] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const messageInputRef = useRef<HTMLTextAreaElement>(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;

    const joinRoom = useCallback(() => {
        if (playerName && room && socket.connected) {
            console.log('Attempting to join room:', room);
            socket.emit(room, playerName);
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
                reconnect();
            }
        };

        const onConnectError = (error: Error) => {
            console.log('Connection error:', error);
            setIsConnected(false);
            setIsJoined(false);

            const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
            setTimeout(reconnect, timeout);
        };

        const onChatMessage = (message: Message) => {
            console.log("onChatmessage is called")
            if (message.sender !== playerName) {
                console.log('Message received:', message);
                setMessages(prev => [...prev, message]);
            }
        };

        if (!socket.connected) {
            socket.connect();
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('connect_error', onConnectError);
        socket.on('chatMessage', onChatMessage);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('connect_error', onConnectError);
            socket.off('chatMessage', onChatMessage);
        };
    }, [playerName]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const messageContent = messageInputRef.current?.value.trim(); // Access input value via ref

        if (!messageContent || !playerName || !isConnected || !isJoined) {
            console.log('Cannot send message:', {
                hasMessage: !!messageContent,
                hasPlayerName: !!playerName,
                isConnected,
                isJoined
            });
            return;
        }

        const messageData = {
            content: messageContent,
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
                const newMessage: Message = response.message;
                setMessages((prev) => [...prev, newMessage]);
                if (messageInputRef.current) {
                    messageInputRef.current.value = '';
                }
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
        <div
            className="w-[500px] bg-[#111b21] rounded-lg shadow-lg overflow-hidden h-[840px] flex flex-col"
        >
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
                className="h-[90%] overflow-y-auto p-4 space-y-2"
                style={{
                    backgroundImage: `url(${chatBgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {messages.map((message, index) => (
                    <div
                        key={`${message.id}-${index}`}
                        className={`flex flex-col ${message.sender === playerName
                            ? 'items-end'
                            : 'items-start'
                            }`}
                    >
                        <div className={`flex gap-1 ${message.sender === playerName ? 'flex-row-reverse' : ''}`}>
                            <AccountCircleIcon className='text-yellow-500' />
                            <div className={`max-w-[65%] px-2 flex flex-col rounded-lg gap-1 ${message.sender === playerName
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-[#202c33] text-white rounded-tl-none'
                                }`}>
                                {
                                    message.sender !== playerName && <span className="font-bold text-lg text-orange-500 ">
                                        {message.sender}
                                    </span>
                                }
                                <span className="break-words text-lg">
                                    {message.content}
                                </span>
                                <span className="text-xs opacity-75 text-end">
                                    {formatTimestamp(message.timestamp)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form
                onSubmit={handleSendMessage}
                className="border-t p-3 flex gap-2 items-center"
            >
                <textarea
                    ref={messageInputRef}
                    placeholder={
                        !isConnected ? "Connecting..." :
                            !isJoined ? "Joining room..." :
                                "Type a message..."
                    }
                    disabled={!isConnected || !isJoined}
                    className="flex-1 px-3 py-2 border rounded-md disabled:opacity-50 bg-[#202c33] text-white max-h-16 "
                />
                <button
                    type="submit"
                    disabled={!isConnected || !isJoined}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 h-10"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;
