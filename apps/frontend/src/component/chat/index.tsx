import React, { useState, useEffect, useRef, useCallback } from 'react';
import { socket } from '../../socket';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import chatBgImage from '../../assets/images/chat-bg-image.png'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react';
import MoodIcon from '@mui/icons-material/Mood';
interface Message {
    id: string;
    sender: string;
    content: string;
    timestamp: number;
    systemFlag: boolean;
}

interface ChatProps {
    playerName: string | null;
    room: string;
}

const Chat: React.FC<ChatProps> = ({ playerName, room }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(true);
    const [isJoined, setIsJoined] = useState(true);
    const [emojiOpen, setEmojiOpen] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const messageInputRef = useRef<HTMLInputElement>(null);
    const reconnectAttempts = useRef(0);
    const flag = useRef(false);
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
        if (flag.current) return;
        flag.current = true
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

        // const onChatMessage = (message: Message, ) => {
        //     console.log("onChatmessage is called")
        //     if (message.sender !== playerName) {
        //         console.log('Message received:', message);
        //         setMessages(prev => [...prev, message]);
        //     }
        // };

        if (!socket.connected) {
            socket.connect();
        }
        socket.onAny((message, ...arg) => {
            debugger
            if (message !== 'chatMessage') return
            const messObj = arg[0]
            console.log('Message received:', messObj);
            // if (messObj.systemFlag) {
            //     console.log("system message");
            //     setChatPlayers(prev => [...prev, messObj])
            //     return;
            // }
            if (messObj.sender !== playerName) {
                setMessages(prev => [...prev, messObj]);
            }
        })
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('connect_error', onConnectError);
        // socket.on('chatMessage', onChatMessage);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('connect_error', onConnectError);
            // socket.off('chatMessage', onChatMessage);
        };
    }, [playerName]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        debugger
        e.preventDefault();
        const messageContent = messageInputRef.current?.value.trim();

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

    const handleEmojiSelect = (emoji: any) => {
        setEmojiOpen(false); // Close the emoji picker
        if (messageInputRef.current) {
            const input = messageInputRef.current;
            const start = input.selectionStart ?? 0;
            const end = input.selectionEnd ?? 0;
            const value = input.value;

            // Insert the emoji at the caret position
            const newValue =
                value.slice(0, start) + emoji.native + value.slice(end);
            input.value = newValue;

            // Move caret after the inserted emoji
            input.setSelectionRange(start + emoji.native.length, start + emoji.native?.length);

            // Trigger input's onChange or similar event if needed
            input.dispatchEvent(new Event("input", { bubbles: true }));
        }
    };

    return (
        <div
            className="bg-[#111b21] rounded-lg overflow-hidden flex flex-col h-full"
        >
            <div className="bg-blue-600 p-3 flex justify-between items-center h-[8%] overflow-hidden">
                <h3 className="text-white font-semibold">
                    Chat Room: {room}
                    {!isJoined && isConnected && " (Joining...)"}
                </h3>
                <div className="flex items-center gap-2">
                    <span
                        className={`w-3 min-h-3 rounded-full ${isConnected && isJoined ? 'bg-green-400' :
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
                className=" overflow-y-auto px-1 py-2 space-y-2 h-[82%] overflow-hidden"
                style={{
                    backgroundImage: `url(${chatBgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {messages.map((message, index) => (
                    message.systemFlag ? (
                        // System Message
                        <div
                            key={`${message.id}-${index}`}
                            className="w-full flex justify-center overflow-ellipsis"
                        >
                            <p className="text-sm bg-[#202c33] text-gray-400 px-2 rounded-lg text-center">
                                {message.content}
                            </p>
                        </div>
                    ) : (
                        <div
                            key={`${message.id}-${index}`}
                            className={`flex flex-col w-full ${message.sender === playerName ? 'items-end' : 'items-start'}`}
                        >
                            <div className={`flex gap-1 w-full ${message.sender === playerName ? 'flex-row-reverse' : ''}`}>
                                <AccountCircleIcon className="text-yellow-500" />
                                <div
                                    className={`max-w-[90%] px-2 flex flex-col rounded-lg gap-1 
                    ${message.sender === playerName
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-[#202c33] text-white rounded-tl-none'
                                        }`}
                                >
                                    {message.sender !== playerName && (
                                        <span className="font-bold text-xs text-orange-500">
                                            {message.sender}
                                        </span>
                                    )}
                                    <span className="break-words text-sm">
                                        {message.content}
                                    </span>
                                    <span className="text-[0.625rem] opacity-75 text-end">
                                        {formatTimestamp(message.timestamp)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                ))}


                <div ref={messagesEndRef} />
            </div>

            <form
                onSubmit={handleSendMessage}
                className="relative border-t p-3 flex gap-2 items-center h-[10%] overflow-visible bg-[#121212]"
            >
                <div className="relative flex items-center gap-2 flex-1">
                    <input
                        ref={messageInputRef}
                        placeholder={
                            !isConnected ? "Connecting..." :
                                !isJoined ? "Joining room..." :
                                    "Type a message..."
                        }
                        disabled={!isConnected || !isJoined}
                        className="w-full px-3 py-2 border rounded-md disabled:opacity-50 bg-[#202c33] text-white max-h-16 focus:outline-none"
                        onKeyDown={(event) => {
                            if (event.code === "Space") {
                                event.stopPropagation();
                            }
                        }}
                    />
                    <div className="relative">
                        <MoodIcon
                            onClick={() => setEmojiOpen((prev) => !prev)}
                            className="cursor-pointer text-gray-500 hover:text-gray-300"
                        />
                        {emojiOpen && (
                            <div className="fixed bottom-28 right-4 bg-white shadow-lg border rounded-md h-80 overflow-hidden">
                                <div className="relative z-2">
                                    <Picker
                                        data={data}
                                        onEmojiSelect={handleEmojiSelect}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={!isConnected || !isJoined}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 h-10"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;
