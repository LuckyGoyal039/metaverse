import React, { useEffect, useRef } from 'react';
import Canvas from '../canvas';
import Chat from '../chat';
import { socket } from '../../socket';

interface SpaceArenaProps {
    playerName: string | null
}
const SpaceArena: React.FC<SpaceArenaProps> = ({ playerName }) => {
    const ROWS = useRef(15);
    const COLS = useRef(25);
    const TILE_SIZE = useRef(32);
    const room = "demo-room";

    useEffect(() => {
        socket.connect();
        socket.removeAllListeners();
        return () => {
            socket.disconnect();
            socket.removeAllListeners();
        }

    }, [])
    return (
        <>
            <Canvas rows={ROWS.current} cols={COLS.current} tile_size={TILE_SIZE.current} playerName={playerName} room={room} />
        </>
    )
}
export default SpaceArena