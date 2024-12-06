import React, { useRef, useEffect } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import chatBgImage from '../../assets/images/chat-bg-image.png';
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
    messages: Message[];
}

const Chat: React.FC<ChatProps> = ({ playerName, room, messages }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageInputRef = useRef<HTMLTextAreaElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const messageContent = messageInputRef.current?.value.trim();

        if (!messageContent || !playerName) {
            return;
        }

        const messageData = {
            content: messageContent,
            sender: playerName,
            room: room
        };

        socket.timeout(5000).emit('sendMessage', messageData, (err: Error | null, response: { success: boolean, message?: Message }) => {
            if (err) {
                console.error('Message send timeout:', err);
                return;
            }

            if (response?.success && response?.message && messageInputRef.current) {
                messageInputRef.current.value = '';
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
        <div className="w-[500px] bg-[#111b21] rounded-lg shadow-lg overflow-hidden h-[840px] flex flex-col">
            <div className="bg-blue-600 p-3 flex justify-between items-center">
                <h3 className="text-white font-semibold">Chat Room: {room}</h3>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-400" title="Connected" />
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
                        className={`flex flex-col ${message.sender === playerName ? 'items-end' : 'items-start'}`}
                    >
                        <div className={`flex gap-1 ${message.sender === playerName ? 'flex-row-reverse' : ''}`}>
                            <AccountCircleIcon className='text-yellow-500' />
                            <div className={`max-w-[65%] px-2 flex flex-col rounded-lg gap-1 ${
                                message.sender === playerName
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-[#202c33] text-white rounded-tl-none'
                            }`}>
                                {message.sender !== playerName && (
                                    <span className="font-bold text-lg text-orange-500">
                                        {message.sender}
                                    </span>
                                )}
                                <span className="break-words text-lg">{message.content}</span>
                                <span className="text-xs opacity-75 text-end">
                                    {formatTimestamp(message.timestamp)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2 items-center">
                <textarea
                    ref={messageInputRef}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border rounded-md bg-[#202c33] text-white max-h-16"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;