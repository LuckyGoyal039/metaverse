import React, { useRef } from 'react';
import Canvas from '../canvas';
import Chat from '../chat';

interface SpaceArenaProps {
    playerName: string | null
    room?: string
}

const SpaceArena: React.FC<SpaceArenaProps> = ({ playerName, room = "demo-room" }) => {
    const ROWS = useRef(20);
    const COLS = useRef(35);
    const TILE_SIZE = useRef(32);

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
                    <Chat playerName={playerName} room={room} />
                </div>

            </div>
        </>
    );
};

export default SpaceArena;