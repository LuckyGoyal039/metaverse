import React, { useEffect, useRef, useState } from 'react';
import Canvas from '../canvas';
import Chat from '../chat';
import { socket } from '../../socket';

interface SpaceArenaProps {
    playerName: string | null
}
interface Message {
    id: string;
    sender: string;
    content: string;
    timestamp: number;
}

const SpaceArena: React.FC<SpaceArenaProps> = ({ playerName }) => {
    const ROWS = useRef(20);
    const COLS = useRef(35);
    const TILE_SIZE = useRef(32);
    const room = "demo-room";
    const [chatMessages, setChatMessages] = useState<Message[]>([])

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
            console.log('Socket connected');
        }

        const handleConnect = () => {
            console.log(`Joining room: ${room} as ${playerName}`);
            socket.emit('joinRoom', { room, name: playerName });
        };

        const handleChatMessage = (message: Message) => {
            if (message.sender !== playerName) {
                setChatMessages(prev => [...prev, message]);
            }
        };

        socket.on('connect', handleConnect);
        socket.on('chatMessage', handleChatMessage);

        return () => {
            socket.off('connect', handleConnect);
            socket.disconnect();
            socket.off('chatMessage', handleChatMessage);
            console.log('Socket cleanup executed');
        };
    }, []);
    return (
        <>
            <div className='flex'>
                <div className='flex flex-col w-[70%] h-full gap-5 justify-center mt-5'>
                    <div>
                        <h1 className='text-white text-5xl text-center'>Welcome to {room}</h1>
                    </div>
                    <div className='flex justify-center'>
                        <div className='border-[30px] rounded-2xl border-red-500 mt-16'>
                            <Canvas
                                rows={ROWS.current}
                                cols={COLS.current}
                                tile_size={TILE_SIZE.current}
                                playerName={playerName}
                                room={room}
                            />
                        </div>
                    </div>
                </div>
                <div className='fixed bottom-4 right-4'>
                    <Chat messages={chatMessages} playerName={playerName} />
                </div>

            </div>
        </>
    );
};

export default SpaceArena;